"""
SharePoint Online → Open WebUI RAG Sync
Detecta archivos nuevos/modificados/eliminados y mantiene la knowledge base actualizada.
"""

import os
import json
import logging
import sqlite3
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import requests
from msal import ConfidentialClientApplication

# ─── Configuración ────────────────────────────────────────────────────────────

SHAREPOINT_TENANT_ID   = os.environ["SP_TENANT_ID"]       # ej: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
SHAREPOINT_CLIENT_ID   = os.environ["SP_CLIENT_ID"]        # App Registration en Azure
SHAREPOINT_CLIENT_SECRET = os.environ["SP_CLIENT_SECRET"]  # Secreto de la app
SHAREPOINT_SITE_URL    = os.environ["SP_SITE_URL"]         # ej: "https://touron.sharepoint.com/sites/taller"

# Carpetas de SharePoint que quieres sincronizar (rutas relativas al site)
WATCH_FOLDERS = [
    "/Documentos compartidos/Manuales técnicos",
    "/Documentos compartidos/Procedimientos",
    # Añade más carpetas aquí
]

# Extensiones de archivo que se van a indexar
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".md", ".xlsx", ".pptx"}

OWUI_BASE_URL       = os.environ["OWUI_BASE_URL"]    # ej: "http://open-webui:3000"
OWUI_API_KEY        = os.environ["OWUI_API_KEY"]     # Settings → Account → API Key en Open WebUI
OWUI_KNOWLEDGE_ID   = os.environ["OWUI_KNOWLEDGE_ID"] # ID de la knowledge base en Open WebUI

STATE_DB_PATH = "/data/sync_state.db"  # Volumen persistente en Docker

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
            sp_item_id      TEXT PRIMARY KEY,
            sp_path         TEXT NOT NULL,
            owui_file_id    TEXT,
            last_modified   TEXT NOT NULL,
            last_synced     TEXT NOT NULL
        )
    """)
    con.commit()
    return con


def get_indexed(con, sp_item_id):
    row = con.execute(
        "SELECT * FROM indexed_files WHERE sp_item_id = ?", (sp_item_id,)
    ).fetchone()
    return row


def upsert_indexed(con, sp_item_id, sp_path, owui_file_id, last_modified):
    con.execute("""
        INSERT INTO indexed_files (sp_item_id, sp_path, owui_file_id, last_modified, last_synced)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(sp_item_id) DO UPDATE SET
            owui_file_id  = excluded.owui_file_id,
            last_modified = excluded.last_modified,
            last_synced   = excluded.last_synced
    """, (sp_item_id, sp_path, owui_file_id, last_modified, datetime.now(timezone.utc).isoformat()))
    con.commit()


def delete_indexed(con, sp_item_id):
    con.execute("DELETE FROM indexed_files WHERE sp_item_id = ?", (sp_item_id,))
    con.commit()


def get_all_indexed_ids(con):
    rows = con.execute("SELECT sp_item_id, owui_file_id FROM indexed_files").fetchall()
    return {row[0]: row[1] for row in rows}

# ─── Microsoft Graph API ──────────────────────────────────────────────────────

def get_graph_token():
    app = ConfidentialClientApplication(
        SHAREPOINT_CLIENT_ID,
        authority=f"https://login.microsoftonline.com/{SHAREPOINT_TENANT_ID}",
        client_credential=SHAREPOINT_CLIENT_SECRET,
    )
    result = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
    if "access_token" not in result:
        raise RuntimeError(f"Error obteniendo token: {result.get('error_description')}")
    return result["access_token"]


def graph_get(token, url):
    resp = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    resp.raise_for_status()
    return resp.json()


def get_site_id(token, site_url):
    # Extraer host y path del site URL
    # ej: https://touron.sharepoint.com/sites/taller → touron.sharepoint.com:/sites/taller
    parts = site_url.replace("https://", "").split("/", 1)
    host = parts[0]
    path = parts[1] if len(parts) > 1 else ""
    url = f"https://graph.microsoft.com/v1.0/sites/{host}:/{path}"
    data = graph_get(token, url)
    return data["id"]


def list_folder_files(token, site_id, folder_path):
    """Lista recursivamente todos los archivos de una carpeta."""
    encoded = requests.utils.quote(folder_path)
    url = f"https://graph.microsoft.com/v1.0/sites/{site_id}/drive/root:{encoded}:/children"
    files = []
    while url:
        data = graph_get(token, url)
        for item in data.get("value", []):
            if "folder" in item:
                # Recursar en subcarpetas
                sub_path = f"{folder_path}/{item['name']}"
                files.extend(list_folder_files(token, site_id, sub_path))
            elif "file" in item:
                ext = Path(item["name"]).suffix.lower()
                if ext in ALLOWED_EXTENSIONS:
                    files.append(item)
        url = data.get("@odata.nextLink")
    return files


def download_file(token, download_url):
    resp = requests.get(download_url, headers={"Authorization": f"Bearer {token}"})
    resp.raise_for_status()
    return resp.content

# ─── Open WebUI API ───────────────────────────────────────────────────────────

def owui_headers():
    return {
        "Authorization": f"Bearer {OWUI_API_KEY}",
    }


def owui_upload_file(filename, content):
    """Sube un archivo a Open WebUI y devuelve su file_id."""
    url = f"{OWUI_BASE_URL}/api/v1/files/"
    files = {"file": (filename, content)}
    resp = requests.post(url, headers=owui_headers(), files=files)
    resp.raise_for_status()
    return resp.json()["id"]


def owui_add_to_knowledge(file_id):
    """Añade un archivo ya subido a la knowledge base."""
    url = f"{OWUI_BASE_URL}/api/v1/knowledge/{OWUI_KNOWLEDGE_ID}/file/add"
    resp = requests.post(url, headers={**owui_headers(), "Content-Type": "application/json"},
                         json={"file_id": file_id})
    resp.raise_for_status()


def owui_delete_file(file_id):
    """Elimina un archivo de Open WebUI (y sus vectores asociados)."""
    url = f"{OWUI_BASE_URL}/api/v1/files/{file_id}"
    resp = requests.delete(url, headers=owui_headers())
    if resp.status_code not in (200, 204, 404):
        resp.raise_for_status()

# ─── Lógica de sincronización ─────────────────────────────────────────────────

def sync():
    log.info("Iniciando sincronización SharePoint → Open WebUI")
    con = init_db()
    token = get_graph_token()
    site_id = get_site_id(token, SHAREPOINT_SITE_URL)

    # Recopilar todos los archivos actuales en SharePoint
    sp_files = {}
    for folder in WATCH_FOLDERS:
        log.info(f"Escaneando carpeta: {folder}")
        items = list_folder_files(token, site_id, folder)
        for item in items:
            sp_files[item["id"]] = item

    # Detectar archivos eliminados en SharePoint
    indexed = get_all_indexed_ids(con)
    for sp_id, owui_file_id in indexed.items():
        if sp_id not in sp_files:
            log.info(f"Eliminado en SharePoint, borrando de Open WebUI: {sp_id}")
            if owui_file_id:
                owui_delete_file(owui_file_id)
            delete_indexed(con, sp_id)

    # Procesar archivos nuevos o modificados
    for sp_id, item in sp_files.items():
        sp_modified = item["lastModifiedDateTime"]
        existing = get_indexed(con, sp_id)

        if existing and existing[3] == sp_modified:
            # Sin cambios, saltar
            continue

        filename = item["name"]
        log.info(f"{'Actualizando' if existing else 'Indexando nuevo'}: {filename}")

        # Borrar versión anterior si existe
        if existing and existing[2]:
            owui_delete_file(existing[2])

        # Descargar de SharePoint
        download_url = item["@microsoft.graph.downloadUrl"]
        content = download_file(token, download_url)

        # Subir a Open WebUI y añadir a knowledge base
        try:
            file_id = owui_upload_file(filename, content)
            owui_add_to_knowledge(file_id)
            upsert_indexed(con, sp_id, item.get("webUrl", ""), file_id, sp_modified)
            log.info(f"  ✓ {filename} indexado (file_id: {file_id})")
        except Exception as e:
            log.error(f"  ✗ Error procesando {filename}: {e}")

    log.info("Sincronización completada")
    con.close()


if __name__ == "__main__":
    sync()
