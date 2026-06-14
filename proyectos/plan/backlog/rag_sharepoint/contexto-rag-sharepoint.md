# Contexto: RAG local con Open WebUI + SharePoint Online

Estoy desarrollando una infraestructura de IA local para mi empresa (Touron S.A., distribuidor oficial de Mercury, ~50 empleados, Madrid). Soy el técnico de IT y estoy diseñando un sistema RAG corporativo.

## Stack decidido

- **Open WebUI** como interfaz de chat y gestión de knowledge bases
- **Ollama** como servidor LLM local
- **ChromaDB** (incluido en Open WebUI) como base de datos vectorial
- **SharePoint Online (Microsoft 365)** como fuente de documentos
- Todo desplegado en **Docker** (docker-compose)

## Arquitectura diseñada

```
Azure AD (autenticación)
      ↓ token OAuth2 client credentials
sync.py (contenedor Docker)
      ├── Lee archivos de SharePoint via Microsoft Graph API
      └── Sube archivos a Open WebUI via REST API
            └── Open WebUI embedea y guarda en ChromaDB
```

El script `sync.py` corre en su propio contenedor, **no dentro de Open WebUI**. Open WebUI simplemente recibe archivos via su API REST y hace el embedding.

## Archivos ya generados

Se generó un stack completo con estos archivos:

- `sync.py` — script Python principal de sincronización
- `docker-compose.yml` — tres servicios: open-webui, ollama, sharepoint-sync
- `Dockerfile` — imagen del contenedor de sync
- `entrypoint.sh` — bucle periódico con SYNC_INTERVAL_MINUTES
- `requirements.txt` — msal, requests
- `.env.example` — plantilla de variables de entorno
- `README.md` — guía de setup completa

## Lógica del sync.py

1. Obtiene token de Azure AD via MSAL (client credentials flow)
2. Llama a Microsoft Graph API para listar archivos de las carpetas configuradas en `WATCH_FOLDERS`
3. Compara `lastModifiedDateTime` de cada archivo con el estado guardado en SQLite (`/data/sync_state.db`)
4. Para archivos **nuevos**: sube a Open WebUI → añade a Knowledge Base
5. Para archivos **modificados**: borra vectores antiguos → sube versión nueva → añade a KB
6. Para archivos **eliminados en SharePoint**: borra de Open WebUI (y sus vectores)
7. Guarda estado en SQLite con: `sp_item_id`, `sp_path`, `owui_file_id`, `last_modified`, `last_synced`

## Variables de entorno necesarias

```env
SP_TENANT_ID=           # Directory (tenant) ID de Azure
SP_CLIENT_ID=           # Application (client) ID del App Registration
SP_CLIENT_SECRET=       # Client secret generado en Azure
SP_SITE_URL=            # https://touron.sharepoint.com/sites/taller

OWUI_BASE_URL=          # http://open-webui:8080 (interno Docker)
OWUI_API_KEY=           # Generado en Open WebUI → Settings → Account → API Keys
OWUI_KNOWLEDGE_ID=      # ID de la KB en Open WebUI (visible en la URL)

SYNC_INTERVAL_MINUTES=60
```

## App Registration en Azure (ya explicado, pendiente de ejecutar)

Permisos necesarios (Application permissions, con admin consent):
- `Sites.Read.All` (Microsoft Graph)
- `Files.Read.All` (Microsoft Graph)

Valores a copiar tras crear la app:
- Application (client) ID → `SP_CLIENT_ID`
- Directory (tenant) ID → `SP_TENANT_ID`
- Client secret → `SP_CLIENT_SECRET`

## API de Open WebUI usada por el script

```
POST   /api/v1/files/                        → sube archivo, devuelve file_id
POST   /api/v1/knowledge/{KNOWLEDGE_ID}/file/add → asocia archivo a KB
DELETE /api/v1/files/{file_id}               → borra archivo y sus vectores
```

## Pendiente / próximos pasos

- [ ] Decidir modelo de embeddings (por defecto usa el LLM de Ollama; recomendado usar `nomic-embed-text` o `mxbai-embed-large` como modelo dedicado)
- [ ] Configurar `WATCH_FOLDERS` en sync.py con las carpetas reales de SharePoint
- [ ] Crear el App Registration en Azure
- [ ] Crear la Knowledge Base en Open WebUI y obtener su ID
- [ ] Decidir si arrancar piloto solo con taller/posventa o más departamentos
- [ ] Valorar activar hybrid search en Open WebUI (desactivado por defecto)
- [ ] Considerar security trimming si distintos usuarios no deben ver los mismos documentos

## Preguntas abiertas

- ¿Qué modelo LLM se usará en Ollama? (no definido aún)
- ¿Hardware del servidor donde se desplegará? (no definido aún)
- ¿Cuántos documentos aproximadamente en el piloto inicial?
