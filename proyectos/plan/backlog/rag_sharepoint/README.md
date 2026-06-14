# SharePoint → Open WebUI RAG Sync

Sincronización automática de documentos desde SharePoint Online hacia una Knowledge Base de Open WebUI.

## Estructura de archivos

```
sharepoint-sync/
├── docker-compose.yml   # Stack completo (Open WebUI + Ollama + Sync)
├── Dockerfile           # Imagen del servicio de sync
├── sync.py              # Lógica de sincronización
├── entrypoint.sh        # Bucle periódico
├── requirements.txt     # Dependencias Python
├── .env.example         # Plantilla de variables de entorno
└── README.md
```

## Configuración previa en Azure

1. Ve a https://portal.azure.com → **Azure Active Directory → App registrations → New registration**
2. Nombre: `OpenWebUI-SharePoint-Sync` (o el que prefieras)
3. En **Certificates & secrets** → crea un Client Secret y cópialo
4. En **API permissions** → añade:
   - `Sites.Read.All` (Microsoft Graph, Application)
   - `Files.Read.All` (Microsoft Graph, Application)
5. Pulsa **Grant admin consent**
6. Copia el **Application (client) ID** y el **Directory (tenant) ID**

## Puesta en marcha

```bash
# 1. Clona o copia esta carpeta en tu servidor
cd sharepoint-sync

# 2. Crea el fichero .env a partir de la plantilla
cp .env.example .env
# Edita .env con tus valores reales

# 3. Arranca el stack
docker compose up -d

# 4. (Primera vez) Crea la Knowledge Base en Open WebUI
#    Workspace → Knowledge → + New Knowledge Base
#    Copia el ID de la URL y ponlo en .env como OWUI_KNOWLEDGE_ID

# 5. Reinicia el sync para que coja el nuevo ID
docker compose restart sharepoint-sync
```

## Carpetas a sincronizar

Edita `sync.py` y modifica la lista `WATCH_FOLDERS`:

```python
WATCH_FOLDERS = [
    "/Documentos compartidos/Manuales técnicos",
    "/Documentos compartidos/Procedimientos",
]
```

## Formatos de archivo soportados

Por defecto: `.pdf`, `.docx`, `.doc`, `.txt`, `.md`, `.xlsx`, `.pptx`

Modifica `ALLOWED_EXTENSIONS` en `sync.py` para añadir o quitar.

## Ver logs del sync

```bash
docker logs -f sharepoint-sync
```

## Forzar una sincronización manual

```bash
docker exec sharepoint-sync python sync.py
```

## Estado de la sincronización

El estado se guarda en un SQLite en el volumen `sync-state` (`/data/sync_state.db`).
Puedes inspeccionarlo con:

```bash
docker exec sharepoint-sync sqlite3 /data/sync_state.db \
  "SELECT sp_path, last_modified, last_synced FROM indexed_files;"
```
