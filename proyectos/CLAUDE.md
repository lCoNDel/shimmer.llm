# Shimmer LLM — Contexto del Proyecto

## Qué es Shimmer

Plataforma de IA local en fase de **demo y testing**, con objetivo de despliegue en servidor dedicado (pendiente). Desarrollada por **Luis Conde**, Técnico de Sistemas en **Touron S.A.** (distribuidor oficial Mercury/Brunswick, ~50 empleados, Madrid).

Núcleo: **Open WebUI + Docker + Ollama**. Ollama corre en el host Windows; el resto de servicios en contenedores Docker.

**Idioma de trabajo**: español. El código y commits pueden estar en inglés.

---

## Stack Técnico

| Servicio | Tecnología | Puerto |
|---|---|---|
| Interfaz principal | Open WebUI v0.9.4 | 3000 (prod) / 3002 (dev) |
| Alternativa | AnythingLLM | 3001 |
| LLM local | Ollama (host Windows) | 11434 |
| Carta náutica | tsamaps (FastAPI + Leaflet) | 5050 |
| Acceso a archivos | Filebrowser (inyectable, sin imagen Docker) | 8001–8002 |
| Bots | Python — Long Polling | Sin puerto |

Esquema de puertos — consultarlo siempre antes de añadir un nuevo servicio:

| Puerto | Servicio |
|---|---|
| 3000 | Open WebUI (Producción) |
| 3001 | AnythingLLM (Producción) |
| 3002 | Open WebUI (Dev) |
| 3003–3099 | Reservado (Flowise, etc.) |
| 4001–4099 | Reservado para futuros contenedores experimentales |
| 5000–5049 | APIs nativas, webhooks, microservicios, puentes de IA |
| 5050 | tsamaps (prod y dev comparten puerto — no arrancar simultáneamente) |
| 5051–5099 | Reservado tsamaps y otros proxies |
| 8000 | Filebrowser Global (acceso raíz a todo el árbol) |
| 8001 | Filebrowser Inyectable → Open WebUI |
| 8002 | Filebrowser Inyectable → AnythingLLM |
| 8003–8099 | Reservado (Grafana, Portainer, etc.) |
| 11434 | Ollama (Host Windows) |
| 5432 / 5433 | PostgreSQL |
| 6379 | Redis |

Los bots Long Polling (Telegram, WhatsApp, Discord) no requieren exponer puertos, salvo arquitectura de webhooks (usaría el bloque 5000).

## Ollama en Windows + Docker

Ollama corre **directamente en el host Windows** (no en Docker). Los contenedores se conectan mediante `host.docker.internal`, que Docker Desktop resuelve automáticamente a la IP del host.

| Variable | Valor | Descripción |
|---|---|---|
| `OLLAMA_HOST` | `127.0.0.1:11434` | Interfaz y puerto donde escucha Ollama |
| `OLLAMA_KEEP_ALIVE` | `600` | Segundos que un modelo permanece cargado sin actividad |
| `OLLAMA_MAX_LOADED_MODELS` | `3` | Máximo de modelos simultáneamente en memoria |
| `OLLAMA_NUM_PARALLEL` | `4` | Peticiones paralelas que puede procesar |

En los Docker Compose se usa:
```yaml
environment:
  - OLLAMA_BASE_URL=http://host.docker.internal:11434
```

`OLLAMA_HOST=127.0.0.1` normalmente bloquearía el acceso desde contenedores, pero Docker Desktop en Windows enruta `host.docker.internal` de forma que sí alcanza el loopback del host. Si la conexión falla, cambiar a `OLLAMA_HOST=0.0.0.0:11434` (requiere reiniciar el servicio Ollama desde Variables de Entorno del sistema Windows).

Verificar conectividad desde un contenedor:
```bash
docker exec -it open-webui curl http://host.docker.internal:11434/api/tags
```

---

## Estructura de `proyectos/`

```
proyectos/
├── .backlog/   # Ideas y proyectos futuros (ACTIVO — consultar al planificar)
├── .claude/    # Configuración Claude Code (no editar)
├── .docker/    # Infraestructura Docker, bots y workflows
├── .docs/      # Documentación de servicios
├── .agents/    # Skills y agentes
├── .log/       # Changelogs de sesión por proyecto (ACTIVO — leer antes de modificar)
├── .tunnel/    # Accesos rápidos para exponer servicios (Tailscale)
└── .webapps/   # Proyectos web del ecosistema Shimmer
```

---

## Detalle de Carpetas

### `.backlog/`
Backlog activo. Prefijo `OK` = ya implementado. Leer antes de planificar trabajo nuevo.

### `.docker/`
```
.docker/
├── .bots/telegram/         # Bots de Telegram (todos los .py van aquí, sin subcarpetas)
│   ├── asistente_nautico.py
│   ├── asistente_servicio.py
│   └── requirements.txt    # Compartido por todos los bots de Telegram
├── branding/               # Rebrand Open WebUI Dev (Touron LLM)
│   ├── custom.css          # Paleta azul marino — bind mount en dev.yml
│   ├── favicon.png         # Logo Touron redondeado — bind mount en dev.yml
│   └── touron-logo.jpg     # Logo original descargado
├── compose/
│   ├── prod.yml            # 1-produccion — Open WebUI + AnythingLLM
│   ├── dev.yml             # 2-desarrollo — Open WebUI Dev (puerto 3002)
│   ├── proxy.yml           # 3-proxy — tsamaps_server (puerto 5050)
│   ├── bots.yml            # 4-bots — asistente_nautico, asistente_servicio
│   └── tools.yml
├── backup/                 # Scripts de backup de volúmenes
├── filebrowser/            # Filebrowser inyectable — inject_internal.ps1 copia el binario en open-webui (8001) y anything-llm (8002). Sin imagen Docker.
└── openweb/                # Workflows y recursos de Open WebUI
    ├── tools/              # Tools Python para Open WebUI
    └── workflows/          # Procedimientos de operación de Open WebUI
```
Nuevas plataformas de bots → nueva subcarpeta en `.bots/` (ej. `telegram/`). Los `.py` van siempre planos dentro de su carpeta de plataforma.

### `.agents/`
Skills en `.agents/skills/[nombre]/SKILL.md`. Formato y convenciones: ver `.agents/god/SKILL.md`.
Al crear o modificar una skill, seguir ese estándar.

### `.log/`
Changelogs de sesión. Generados automáticamente con la skill `fin-sesion` al cerrar cada sesión de trabajo.
```
.log/
└── changelog_YYYY-MM-DD.md
```
Un único archivo por día. Si en la sesión se trabajó en varios proyectos, el changelog los agrupa en secciones. Leer el del día anterior antes de empezar — contiene contexto técnico exacto, decisiones de diseño y estado de variables.

### `.tunnel/`
```
.tunnel/
└── openweb.bat     # Expone Open WebUI (legacy)
```

### `.webapps/`
```
.webapps/
├── prod/tsamaps/   # Carta náutica interactiva — única copia activa, puerto 5050
└── antiguos/       # Archivados — excluidos de git
```

**tsamaps** — app web (HTML/CSS/JS vanilla, Leaflet, OpenSeaMap, CartoDB) con servidor FastAPI consolidado en el puerto 5050 (estáticos + proxy `/chat` hacia Open WebUI).
Archivos principales: `app.js`, `index.html`, `index.css`, `responsive.css`, `server.py`.
Todo el JS en un único `DOMContentLoaded`. Arrancado vía `docker compose` con `proxy.yml` → servicio `tsamaps_server`.
**Changelogs en `.log/`** — incluyen contexto técnico exacto para agentes. Leer antes de modificar la app.

---

## Docker Compose — Grupos

| Archivo | Nombre proyecto | Servicios |
|---|---|---|
| `prod.yml` | `1-produccion` | open-webui (3000), anything-llm (3001) |
| `dev.yml` | `2-desarrollo` | open-webui-dev (3002) |
| `proxy.yml` | `3-proxy` | tsamaps_server (5050) |
| `bots.yml` | `4-bots` | asistente_nautico, asistente_servicio |

**Restricciones:**
- No arrancar `open-webui` (prod) y `open-webui-dev` simultáneamente — comparten volumen `open-webui`.
- No arrancar `tsamaps_server` de dev y prod simultáneamente — comparten el puerto 5050.

---

## Rebrand Open WebUI Dev

`open-webui-dev` está configurado como **Touron LLM** mediante:
- `WEBUI_NAME=Touron LLM` en `dev.yml`
- `custom.css` montado en `/app/build/static/custom.css` — paleta azul marino Touron
- `favicon.png` montado en `/app/build/static/favicon.png` — logo Touron redondeado
- Parche en `env.py` del contenedor para eliminar el sufijo `(Open WebUI)` — **se pierde al recrear el contenedor**; reaplicar según `.docker/openweb/workflows/update_workflow.md` (paso 7)

---

## Reglas por zona

### `.webapps/dev/`
Trabajo activo. Cambios libres. Se sincronizan manualmente a prod una vez validados.

### `.webapps/prod/`
**ADVERTENCIA — Doble autorización antes de cualquier cambio:**
1. Describir exactamente qué archivo y qué cambio.
2. Esperar confirmación explícita.
3. Una autorización en `dev/` **no implica autorización en `prod/`**.

### `.webapps/antiguos/`
No se modifican.

---

## Convenciones

- **Idioma**: español siempre, salvo código o contexto técnico.
- **Skills**: respetar formato de `.agents/god/SKILL.md`.
- **Docker prod**: `.docker/compose/prod.yml` — no modificar sin confirmar.
- **Backlog**: consultar `.backlog/` al planificar.
- **Puertos**: respetar esquema en la sección "Stack Técnico" de este CLAUDE.md.
- **Logs**: los changelogs van en `.log/changelog_YYYY-MM-DD.md`, un archivo por día con secciones por proyecto. Leer antes de empezar. Generar con la skill `fin-sesion` al cerrar sesión.

---

## Contexto Empresarial: Touron S.A.

Distribuidor oficial Mercury, Quicksilver, Bayliner, Simrad. ~50 empleados. Sede: Torrejón de Ardoz; sucursal: Cascais (Portugal). ERP: Libra (Oracle). Microsoft 365 + SharePoint Online.
IT: Luis Conde (Sistemas), José Sanz (Oracle), Tomás Ruiz-Roso (Big Data), Viviana Franco (Microsoft).
La skill `asistente-nautico-touron` contiene datos reales — tratar con discreción.

---

## Estado del Proyecto

- **Fase**: Demo y testing en local (Windows)
- **Plataforma elegida**: Open WebUI (decisión firme — LibreChat evaluado y descartado)
- **Próximo paso**: Despliegue en servidor dedicado (pendiente de máquina)
- **RAG SharePoint**: diseñado, pendiente → `.backlog/rag_sharepoint/`
- **Modelo de embeddings**: por decidir (`nomic-embed-text` o `mxbai-embed-large`)
