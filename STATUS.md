# STATUS — Shimmer LLM

> **Última actualización: 2026-09-11**
> Documento autocontenido de estado del proyecto. Es la única fuente de contexto
> para consultas sin acceso al repositorio. Se actualiza al cierre de cada sesión.

---

## 1. Qué es Shimmer

Plataforma de IA desarrollada por Luis Conde (Técnico de Sistemas) para
Touron S.A., distribuidor oficial Mercury/Brunswick en España y Portugal (~50
empleados). **Propósito: ofrecer agentes multimodales y versátiles a toda la
empresa — habrá agentes por departamento con funciones a la carta.** Los primeros
ya operativos: asistente náutico para clientes vía Telegram, RAG sobre manuales
Mercury e interfaz corporativa "Touron LLM". Fase actual: **demo y testing en
local (Windows 11 + Docker Desktop)**, con migración a Azure aprobada para
producción real.

---

## 2. Estado operativo (snapshot 2026-09-11)

⚠️ **Este repositorio (`shimmer.llm`) queda congelado como backup local.**
El proyecto se traslada a una cuenta de empresa: el trabajo activo continúa en
un repo nuevo, `tsa.shimmer` (reestructurado en tres zonas — documentación,
operativa congelada, Claude Code — ver `log/2026/09/changelog_2026-09-11.md`
para el detalle completo). Este repo no vuelve a tocarse salvo consulta.
`docker/backup/` se limpió de 4,75 GB de backups acumulados del volumen
`open-webui` (ver mismo changelog).

⚠️ **Situación temporal importante (heredada, sin cambios esta sesión — [VERIFICAR] si sigue vigente):**
- `open-webui` (prod, puerto 3000) está **PARADO** desde el 12-jun.
- Motivo: se actualizó Open WebUI **dev** a v0.9.6 para validar el fix del bug
  `chat_id` en `/api/chat/completions` (el que rompía clientes API externos).
  Prod y dev comparten volumen, así que prod se paró durante la migración.
- La BD del volumen compartido ya tiene las migraciones de v0.9.6 aplicadas.
  Backup previo: `open-webui-backup-20260612.tar.gz` (2,1 GB, fuera de git).
- **Consecuencia**: el bot de Telegram apunta al 3000 y está sin servicio hasta
  validar dev y decidir: subir prod a v0.9.6 o rearrancar prod en v0.9.4.
- **tsamaps pasa a EOL** (12-jun): desarrollo finalizado; se conserva archivado
  como fuente de conocimiento para futuros proyectos.
- Validación pendiente en dev v0.9.6: API sin `chat_id` + RAG con tool calls
  (hay un issue abierto de la comunidad, #25691, sobre tool calls vía API con Ollama).

---

## 3. Arquitectura actual

Ollama corre **en el host Windows** (no en Docker); los contenedores lo alcanzan
vía `host.docker.internal:11434`. Todo lo demás corre en Docker Desktop.

| Servicio | Tecnología | Puerto | Estado |
|---|---|---|---|
| Open WebUI prod ("Touron LLM") | v0.9.4, Docker | 3000 | Parado (temporal, ver §2) |
| Open WebUI dev | v0.9.6, Docker | 3002 | En validación |
| AnythingLLM | Docker | 3001 | Alternativa, sin uso activo |
| Ollama | Host Windows | 11434 | Operativo |
| tsamaps (carta náutica) | FastAPI + Leaflet, Docker | 5050 (HTTPS Tailscale) | EOL — archivado |
| Bot asistente_nautico | Python long polling, Docker | — | Producción (sin servicio mientras prod parado) |
| Bot asistente_servicio | Python long polling, Docker | — | Esqueleto sin configurar |
| Filebrowser global | Docker (tools.yml) | 8000 | Uso puntual |
| Filebrowser inyectable | Binario inyectado en contenedores | 8001 (OWU) / 8002 (ALLM) | Uso puntual |

**Grupos Docker Compose** (en `docker/compose/`):
`prod.yml` (1-produccion: open-webui + anything-llm) · `dev.yml` (2-desarrollo) ·
`proxy.yml` (3-proxy: tsamaps_server) · `bots.yml` (4-bots) · `tools.yml` (filebrowser).

**Restricciones operativas:**
- Prod y dev de Open WebUI **comparten el volumen** `open-webui` → nunca arrancar ambos a la vez.
- tsamaps prod y dev comparten el puerto 5050 → no simultáneos (solo existe prod desde mayo).
- Bloques de puertos reservados: 3003-3099 contenedores, 5000-5099 APIs/proxies, 8003-8099 utilidades.

**Dependencias externas:** Ollama (inferencia y embeddings local), Tailscale
(HTTPS y acceso remoto; ngrok jubilado), APIs públicas en tsamaps (Open-Meteo,
RainViewer, NOAA, Nominatim), Telegram Bot API.

---

## 4. Estructura del repositorio

En la raíz del repositorio: README.md, LICENSE y este STATUS.md (regenerado al
cierre de cada sesión con la skill `fin-sesion`). El resto vive bajo `proyectos/`:

| Carpeta | Propósito |
|---|---|
| `.claude/` | Config Claude Code: `ops/` (scripts PowerShell start/stop por servicio) y `commands/` (slash commands) |
| `plan/` | Embudo de planificación en 3 niveles: `ideas/` (bloc de notas libre), `spikes/` (en investigación — spike Agile: reduce incertidumbre antes de comprometerse), `backlog/` (comprometido y en cola — incluye diseños completos rag_sharepoint, demo_erp_ia), `shimmercloud/` (migración Azure: CLAUDE.md propio, ADRs, plan 5 fases) |
| `agents/` | Skills de agentes (`skills/<nombre>/SKILL.md`): ai-engineer, asesor-nautico, asistente-nautico-touron, diagnostico-motores, docker-backup, docker-expert, openweb-rebrand, etc. |
| `docker/` | Infraestructura: `compose/` (los 5 YML), `bots/telegram/` (los .py de bots), `branding/` (CSS + favicon Touron), `openweb/tools/` (tools Python para Open WebUI, en `stable/` y `experimental/`), `openweb/workflows/` (procedimientos, p.ej. `update_workflow.md`), `backup/` (backups de volúmenes, fuera de git), `certs/` (TLS Tailscale), `filebrowser/` |
| `docs/` | Documentación de servicios: `templates/` (templates reutilizables, ej. system prompt RAG por defecto), `agentes/` (fichas de agentes desplegados en Open WebUI) |
| `log/` | Changelogs de sesión organizados por año/mes (`YYYY/MM/changelog_YYYY-MM-DD.md`) + `CHANGELOG_INDEX.md`. Fuente de verdad del histórico técnico |
| `tunnel/` | Scripts legacy de exposición de servicios (Tailscale gestiona el túnel actual) |
| `webapps/` | `antiguos/` — proyectos EOL (excluidos de git salvo tsamaps, que sigue versionado). `antiguos/tsamaps/` — carta náutica archivada como fuente de conocimiento, arrancable para demos. `prod/` queda vacía para futuros proyectos web |

---

## 5. Estado de componentes

| Componente | Estado | Notas |
|---|---|---|
| Open WebUI ("Touron LLM") | **Producción** (parado temporal, §2) | Plataforma definitiva. Rebrand: CSS azul marino + favicon + parche env.py (se pierde al recrear contenedor; se reaplica por sed por patrón) |
| Bot Telegram asistente_nautico | **Producción** | RAG con native function calling, ciclo de tool calls client-side, búsqueda web DDGS, análisis de PDFs (pymupdf), citas con fuentes reales |
| tsamaps | **EOL — archivado** (12-jun-2026) | Carta náutica OpenSeaMap/CartoDB completa (meteo, radar, viento, MOB, GPS, chat IA vía proxy a Open WebUI). Movida a `.webapps/antiguos/tsamaps/`; sin desarrollo, conservada como fuente de conocimiento. Sigue siendo arrancable para enseñar la demo (scripts `tsamaps-demo-start/stop.ps1`: open-webui + bot + tsamaps en 5050) |
| Tools Open WebUI estables | **Producción** | `query_knowledge` (RAG custom), `calculadora`, `read_file`, `read_g3` (CSV diagnóstico Mercury G3), `generate_doc` |
| Tools experimentales (`dev_*`) | **En desarrollo** | Versiones avanzadas en dev: query_knowledge v2.0 (Valves, multi-KB, bilingüe en una llamada), read_g3 v2.1 (agregados + tabla 134 códigos de fallo Mercury), calculadora/read_file/generate_doc v1.1 |
| Agente taller servicio técnico | **Producción** | RAG multilingüe (manuales Mercury/Brunswick), reconversión de query, búsqueda bilingüe ES+EN en paralelo. Documentado en `docs/agentes/taller_servicio.md`. Roadmap: añadir portugués (Cascais) |
| Bot asistente_servicio | **Pendiente** | Solo esqueleto: sin token, sin modelo, handlers vacíos |
| RAG SharePoint | **Pendiente** (diseñado) | Código sync.py + compose listos en backlog; falta App Registration en Azure AD. Será piloto prioritario tras el despliegue cloud |
| Shimmer Cloud (Azure) | **Planificación** | Aprobado por gerencia mayo 2026; objetivo producción noviembre 2026. Plan de 5 fases escrito; sin VM aprovisionada aún |
| AnythingLLM | **Secundario** | Desplegado como alternativa; sin desarrollo activo |
| demo_erp_ia | **Archivado** | Demo análisis de negocio con CSVs ficticios; guardada en backlog |
| LibreChat | **Descartado** | Evaluado y eliminado (mayo 2026); Open WebUI decisión firme |
| tool web_search.py | **[VERIFICAR]** | Citada como activa en docs de mayo, pero el .py ya no está en el repo; la búsqueda web del bot usa DDGS directamente |

---

## 6. Decisiones técnicas y porqué

- **Open WebUI como plataforma** — LibreChat evaluado en paralelo y descartado (mayo 2026); decisión firme.
- **Migración a Azure aprobada** (gerencia, mayo 2026) — producción real en el tenant corporativo. **Ollama desaparece**: toda la inferencia pasa a Azure OpenAI API (cumple seguridad/privacidad al estar dentro del tenant). ADR-001.
- **VM Linux única con dos entornos** (prod y dev, volúmenes y contenedores independientes) — simplicidad operativa, mismo modelo que funciona en local; VM separada descartada por coste. Candidata: D4as v5, 4 vCPU/16 GB, ~$125/mes + Premium SSD P10/P15 (B4ms descartada: burstable, no apta para 5-15 usuarios). ADR-002/003.
- **Operación cloud con Claude Code vía VS Code Remote-SSH** — mismo flujo que en local. ADR-004.
- **Embeddings bge-m3** (no nomic-embed-text). En cloud, esquema dual: docs internos → bge-m3 en CPU; manuales públicos → text-embedding-3-large (Azure OpenAI).
- **RAG vía tool custom `query_knowledge`** en lugar del Built-in Knowledge de Open WebUI — control de queries secuenciales, scores y citas embebidas.
- **Bots por long polling** — sin exponer puertos; webhooks solo si hiciera falta (bloque 5000).
- **Tailscale para HTTPS y acceso remoto** — ngrok jubilado (mayo 2026).
- **Backups solo de prod** — dev no lleva backup ni rollback (criterio explícito).
- **Documentación sin redundancia** — cada procedimiento vive solo en su workflow .md; CLAUDE.md guarda solo hechos + puntero.
- **Pendientes de decisión (cloud)**: modelo LLM (GPT-4o probable), confirmar Open WebUI como UI, región Azure (West Europe recomendado), acceso externo/dominio, certificados HTTPS.

---

## 7. Backlog priorizado

**Prioridades actuales (definidas en mayo 2026):**
1. **Servidor producción Azure** — VM D4as v5; ver plan de migración (§8).
2. **RAG SharePoint (piloto)** — tras tener el entorno base cloud operativo.

**Resto del backlog (sin orden firme):**
- `add_in_office` — complemento Outlook/Excel: task pane HTML/JS → API Open WebUI, branding Touron, distribución vía M365 Centralized Deployment. MVP estimado 1-2 semanas.
- `docx_open_terminal` — migrar generación de Word a Open Terminal (el modelo genera python-docx y Open WebUI lo ejecuta); pendiente verificar python-docx en Pyodide.
- `diagnosis_motores` — agente de diagnóstico de motores (base ya implementada con read_g3).
- ~~`taller_servicio`~~ — **implementado** (ver §5).
- `base_datos` — integración con ERP Libra (Oracle). Sin detalle definido.
- `rag_obsidian` — RAG sobre vault Obsidian. Sin detalle definido.
- `openweb_limpieza_uploads` — limpieza de uploads/ChromaDB con scripts de comunidad (regla: no borrar /data/ a mano).
- Archivado: `demo_erp_ia` (demo completa con datos ficticios, lista para retomar); ideas tsamaps (calculadora de ruta, alertas meteo, navegación a destino, tracking, compartir posición) — descartadas al pasar tsamaps a EOL.

**Implementados** (prefijo OK): asistente náutico, acceso API desde móvil, diagnosis motores (v1 vía read_g3), conector OneDrive/SharePoint en Open WebUI.

---

## 8. Migración Azure — plan en 5 fases

Estado: **Fase 0 sin iniciar** (nada aprovisionado en Azure todavía).

| Fase | Contenido | Estado |
|---|---|---|
| 0 — Prerequisitos | VM Linux, SSH, recurso Azure OpenAI + modelos (chat por decidir + text-embedding-3-large), región, NSG (22/80/443/5050) | Pendiente |
| 1 — Servidor base | Docker, Node.js, Claude Code, clonar repo | Pendiente |
| 2 — Dev primero | dev.yml sin Ollama → Azure OpenAI; validar RAG y bot en dev | Pendiente |
| 3 — Producción | prod.yml, branding, migrar Knowledge Base (backup+restore volumen) | Pendiente |

tsamaps queda fuera del alcance de la migración (EOL); el plan y los ADRs ya lo
reflejan.
| 4 — Acceso/seguridad | HTTPS, dominio, Tailscale, revisión de secretos | Pendiente |
| 5 — RAG SharePoint piloto | App Registration, sync contra KB de prod, embeddings duales | Pendiente |

Nota operativa: al migrar cambia la API key de Open WebUI → actualizar en
`server.py` (tsamaps) y `asistente_nautico.py`.

---

## 9. Configuración RAG, embeddings y modelos

**Knowledge Base actual:** manuales técnicos Mercury en el ChromaDB interno de
Open WebUI. Acceso vía tool custom `query_knowledge` (no el Built-in).

**Parámetros RAG en local (tuning de mayo 2026):**
- Embeddings: **bge-m3** (servido por Ollama).
- Chunking: 384 tokens (reducido desde 512 tras pruebas).
- Reranker: **BAAI/bge-reranker-v2-m3**; umbral de relevancia 0.45.
- Búsqueda híbrida semántica + BM25; queries bilingües ES/EN (el agente reformula).
- Config objetivo para RAG SharePoint (cloud): chunk 512/100, Top K 12-15, rerank Top K 5, umbral 0.3, BM25 weight 0.3.

**Modelos:**
- Testing local: **qwen3:9b** en RTX 4070 Ti Super (Ollama). Workspace Model
  `asistente-touron` en Open WebUI (system prompt corporativo + KB asociada).
- Producción cloud: Azure OpenAI, modelo por decidir (familia GPT-4o probable).
- El bot de Telegram inyecta su propio SYSTEM_PROMPT en vuelo (identidad
  corporativa + reglas de uso de tools); sin él, el modelo ignora el RAG.

**Ollama (host):** OLLAMA_HOST 127.0.0.1:11434 · KEEP_ALIVE 600s ·
MAX_LOADED_MODELS 3 · NUM_PARALLEL 4.

---

## 10. Contexto empresarial (breve)

Touron S.A.: distribuidor Mercury, Quicksilver, Bayliner, Simrad desde 1958.
Sede Torrejón de Ardoz + sucursal Cascais (PT). ERP Libra (Oracle), Microsoft
365 + SharePoint Online. IT: Luis Conde (Sistemas), José Sanz (Oracle), Tomás
Ruiz-Roso (Big Data), Viviana Franco (Microsoft). Catálogo >5.000 referencias,
equipo SAT con necesidad de diagnóstico rápido — el caso de uso central de Shimmer.
