"""
SharePoint Online → Open WebUI RAG Sync
Detecta archivos nuevos/modificados/eliminados y mantiene la knowledge base actualizada.
"""

import os
import time
import logging
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

import requests
from msal import ConfidentialClientApplication

# ─── Configuración ────────────────────────────────────────────────────────────

SHAREPOINT_TENANT_ID     = os.environ["SP_TENANT_ID"]
SHAREPOINT_CLIENT_ID     = os.environ["SP_CLIENT_ID"]
SHAREPOINT_CLIENT_SECRET = os.environ["SP_CLIENT_SECRET"]
SHAREPOINT_SITE_URL      = os.environ["SP_SITE_URL"]

# Carpetas de SharePoint que quieres sincronizar (rutas relativas al site)
WATCH_FOLDERS = [
    "/Documentos compartidos/Manuales técnicos",
    "/Documentos compartidos/Procedimientos",
    # Añade más carpetas aquí
]

# Extensiones de archivo que se van a indexar
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".md", ".xlsx", ".pptx"}

OWUI_BASE_URL     = os.environ["OWUI_BASE_URL"]
OWUI_API_KEY      = os.environ["OWUI_API_KEY"]
OWUI_KNOWLEDGE_ID = os.environ["OWUI_KNOWLEDGE_ID"]

STATE_DB_PATH = "/data/sync_state.db"

# ─── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ─── Base de datos de estado ──────────────────────────────────────────────────

def init_db():
    con = sqlite3.connect(STATE_DB_PATH)
    con.execute("""
        CREATE TABLE IF NOT EXISTS indexed_files (
            sp_item_id    TEXT PRIMARY KEY,
            sp_path       TEXT NOT NULL,
            owui_file_id  TEXT,
            last_modified TEXT NOT NULL,
            last_synced   TEXT NOT NULL
        )
    """)
    con.commit()
    return con


def get_indexed(con, sp_item_id):
    return con.execute(
        "SELECT sp_item_id, sp_path, owui_file_id, last_modified, last_synced "
        "FROM indexed_files WHERE sp_item_id = ?",
        (sp_item_id,)
    ).fetchone()


def upsert_indexed(con, sp_item_id, sp_path, owui_file_id, last_modified):
    con.execute("""
        INSERT INTO indexed_files (sp_item_id, sp_path, owui_file_id, last_modified, last_synced)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(sp_item_id) DO UPDATE SET
            owui_file_id  = excluded.owui_file_id,
            last_modified = excluded.last_modified,
            last_synced   = excluded.last_synced
    """, (
        sp_item_id,
        sp_path,
        owui_file_id,
        last_modified,
        datetime.now(timezone.utc).isoformat()
    ))
    con.commit()


def delete_indexed(con, sp_item_id):
    con.execute("DELETE FROM indexed_files WHERE sp_item_id = ?", (sp_item_id,))
    con.commit()


def get_all_indexed_ids(con):
    rows = con.execute(
        "SELECT sp_item_id, owui_file_id FROM indexed_files"
    ).fetchall()
    return {row[0]: row[1] for row in rows}

# ─── Microsoft Graph API ──────────────────────────────────────────────────────

def get_graph_token():
    app = ConfidentialClientApplication(
        SHAREPOINT_CLIENT_ID,
        authority=f"https://login.microsoftonline.com/{SHAREPOINT_TENANT_ID}",
        client_credential=SHAREPOINT_CLIENT_SECRET,
    )
    result = app.acquire_token_for_client(
        scopes=["https://graph.microsoft.com/.default"]
    )
    if "access_token" not in result:
        raise RuntimeError(f"Error obteniendo token: {result.get('error_description')}")
    return result["access_token"]


def graph_get(token, url):
    resp = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    resp.raise_for_status()
    return resp.json()


def get_site_id(token, site_url):
    """Obtiene el site ID de SharePoint a partir de la URL del site."""
    parts = site_url.replace("https://", "").split("/", 1)
    host  = parts[0]
    path  = parts[1] if len(parts) > 1 else ""
    data  = graph_get(token, f"https://graph.microsoft.com/v1.0/sites/{host}:/{path}")
    return data["id"]


def list_folder_files(token, site_id, folder_path):
    """Lista recursivamente todos los archivos de una carpeta."""
    encoded = requests.utils.quote(folder_path)
    url     = f"https://graph.microsoft.com/v1.0/sites/{site_id}/drive/root:{encoded}:/children"
    files   = []
    while url:
        data = graph_get(token, url)
        for item in data.get("value", []):
            if "folder" in item:
                sub_path = f"{folder_path}/{item['name']}"
                files.extend(list_folder_files(token, site_id, sub_path))
            elif "file" in item:
                ext = Path(item["name"]).suffix.lower()
                if ext in ALLOWED_EXTENSIONS:
                    files.append(item)
        url = data.get("@odata.nextLink")
    return files


def download_file(token, download_url):
    resp = requests.get(
        download_url,
        headers={"Authorization": f"Bearer {token}"}
    )
    resp.raise_for_status()
    return resp.content

# ─── Open WebUI API ───────────────────────────────────────────────────────────

def owui_headers():
    return {"Authorization": f"Bearer {OWUI_API_KEY}"}


def owui_upload_file(filename, content):
    """Sube un archivo a Open WebUI y devuelve su file_id."""
    url  = f"{OWUI_BASE_URL}/api/v1/files/"
    resp = requests.post(url, headers=owui_headers(), files={"file": (filename, content)})
    resp.raise_for_status()
    return resp.json()["id"]


def owui_wait_for_processing(file_id, timeout=300, poll_interval=2):
    """
    Espera a que Open WebUI termine el chunking y embedding del archivo.
    IMPORTANTE: si se añade el archivo a la KB antes de que esto complete,
    la API devuelve error 400 'content is empty'.
    """
    url   = f"{OWUI_BASE_URL}/api/v1/files/{file_id}/process/status"
    start = time.time()
    while time.time() - start < timeout:
        resp   = requests.get(url, headers=owui_headers())
        resp.raise_for_status()
        status = resp.json().get("status")
        if status == "completed":
            return
        elif status == "failed":
            raise RuntimeError(f"Procesamiento fallido para file_id: {file_id}")
        time.sleep(poll_interval)
    raise TimeoutError(f"Timeout ({timeout}s) esperando procesamiento de file_id: {file_id}")


def owui_add_to_knowledge(file_id):
    """Asocia un archivo ya procesado a la knowledge base."""
    url  = f"{OWUI_BASE_URL}/api/v1/knowledge/{OWUI_KNOWLEDGE_ID}/file/add"
    resp = requests.post(
        url,
        headers={**owui_headers(), "Content-Type": "application/json"},
        json={"file_id": file_id}
    )
    resp.raise_for_status()


def owui_delete_file(file_id):
    """Elimina un archivo de Open WebUI junto con sus vectores."""
    url  = f"{OWUI_BASE_URL}/api/v1/files/{file_id}"
    resp = requests.delete(url, headers=owui_headers())
    if resp.status_code not in (200, 204, 404):
        resp.raise_for_status()

# ─── Lógica de sincronización ─────────────────────────────────────────────────

def sync():
    log.info("═══════════════════════════════════════════")
    log.info("Iniciando sincronización SharePoint → Open WebUI")

    con     = init_db()
    token   = get_graph_token()
    site_id = get_site_id(token, SHAREPOINT_SITE_URL)

    # 1. Recopilar todos los archivos actuales en SharePoint
    sp_files = {}
    for folder in WATCH_FOLDERS:
        log.info(f"Escaneando carpeta: {folder}")
        for item in list_folder_files(token, site_id, folder):
            sp_files[item["id"]] = item
    log.info(f"Total archivos encontrados en SharePoint: {len(sp_files)}")

    # 2. Detectar archivos eliminados en SharePoint → borrar de Open WebUI
    indexed = get_all_indexed_ids(con)
    for sp_id, owui_file_id in indexed.items():
        if sp_id not in sp_files:
            log.info(f"Eliminado en SharePoint → borrando de Open WebUI (sp_id: {sp_id})")
            if owui_file_id:
                try:
                    owui_delete_file(owui_file_id)
                except Exception as e:
                    log.warning(f"  No se pudo borrar file_id {owui_file_id}: {e}")
            delete_indexed(con, sp_id)

    # 3. Procesar archivos nuevos o modificados
    new_count     = 0
    updated_count = 0
    skipped_count = 0
    error_count   = 0

    for sp_id, item in sp_files.items():
        sp_modified = item["lastModifiedDateTime"]
        filename    = item["name"]
        existing    = get_indexed(con, sp_id)

        # Sin cambios → saltar
        if existing and existing[3] == sp_modified:
            skipped_count += 1
            continue

        action = "Actualizando" if existing else "Indexando nuevo"
        log.info(f"{action}: {filename}")

        # Borrar versión anterior si existe
        if existing and existing[2]:
            try:
                owui_delete_file(existing[2])
            except Exception as e:
                log.warning(f"  No se pudo borrar versión anterior de {filename}: {e}")

        # Descargar de SharePoint
        try:
            content = download_file(token, item["@microsoft.graph.downloadUrl"])
        except Exception as e:
            log.error(f"  ✗ Error descargando {filename}: {e}")
            error_count += 1
            continue

        # Subir → esperar procesamiento → añadir a KB
        try:
            file_id = owui_upload_file(filename, content)
            log.info(f"  Archivo subido (file_id: {file_id}), esperando embedding...")

            owui_wait_for_processing(file_id)   # ← espera chunking + embedding
            log.info(f"  Embedding completado")

            owui_add_to_knowledge(file_id)
            upsert_indexed(con, sp_id, item.get("webUrl", ""), file_id, sp_modified)
            log.info(f"  ✓ {filename} indexado correctamente")

            if existing:
                updated_count += 1
            else:
                new_count += 1

        except Exception as e:
            log.error(f"  ✗ Error procesando {filename}: {e}")
            error_count += 1

    # 4. Resumen
    log.info("───────────────────────────────────────────")
    log.info(f"Nuevos: {new_count} | Actualizados: {updated_count} | "
             f"Sin cambios: {skipped_count} | Errores: {error_count}")
    log.info("Sincronización completada")
    con.close()


if __name__ == "__main__":
    sync()