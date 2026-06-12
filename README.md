# shimmer.llm

Plataforma de agentes IA de **Touron S.A.** (distribuidor Mercury/Brunswick, España y Portugal). Desarrollo: Luis Conde, Sistemas.

Objetivo: agentes multimodales por departamento con funciones a la carta — consulta técnica, atención al cliente, documentación interna, análisis de negocio y automatización. Los agentes operativos (asistente náutico, servicio) son los primeros de esa línea.

Stack base: **Open WebUI + Docker + Ollama**. Ollama corre en el host Windows; el resto de servicios en contenedores. Los agentes combinan LLM + RAG sobre Knowledge Bases propias + tools Python.

> **Estado:** demo y testing en local (Windows 11 + Docker Desktop). Migración a producción en Azure aprobada — objetivo noviembre 2026, inferencia vía Azure OpenAI (Ollama desaparece en cloud). Plan y ADRs en `proyectos/.shimmercloud/`.
>
> Estado detallado por sesión: [STATUS.md](STATUS.md). Histórico técnico: `proyectos/.log/`.

---

## Arquitectura

| Servicio | Tecnología | Puerto |
|---|---|---|
| Interfaz principal (Touron LLM) | Open WebUI v0.9.4 | 3000 |
| Interfaz desarrollo | Open WebUI v0.9.6 | 3002 |
| Interfaz alternativa | AnythingLLM | 3001 |
| Inferencia local | Ollama (host Windows) | 11434 |
| Bots | Python — Telegram Long Polling | — |
| Carta náutica (EOL) | tsamaps — FastAPI + Leaflet | 5050 (HTTPS vía Tailscale) |
| Filebrowser | Global / inyectable en contenedores | 8000 / 8001–8002 |

Los contenedores acceden a Ollama mediante `host.docker.internal:11434`. Los bots usan long polling (sin puertos expuestos) y atacan la API de Open WebUI (`/api/chat/completions`) gestionando el ciclo completo de tool calls client-side.

| Compose | Proyecto Docker | Servicios |
|---|---|---|
| prod.yml | 1-produccion | open-webui (3000), anything-llm (3001) |
| dev.yml | 2-desarrollo | open-webui-dev (3002) |
| proxy.yml | 3-proxy | tsamaps_server (5050) — EOL, solo demos |
| bots.yml | 4-bots | asistente_nautico, asistente_servicio |
| tools.yml | — | filebrowser global (8000, uso puntual) |

Restricción: `open-webui` (prod) y `open-webui-dev` comparten el volumen `open-webui` — no arrancar simultáneamente.

### RAG

- Knowledge Bases en ChromaDB (integrado en Open WebUI); corpus actual: manuales técnicos Mercury.
- Embeddings `bge-m3` (Ollama) · reranker `BAAI/bge-reranker-v2-m3` · búsqueda híbrida semántica + BM25 · chunking 384 tokens · umbral de relevancia 0.45.
- Acceso vía tool propia `query_knowledge` (no el Built-in de Open WebUI): queries secuenciales bilingües ES/EN reformuladas por el agente, scores y citas embebidas.

---

## Componentes

**Touron LLM** — instancia Open WebUI con rebrand corporativo (`WEBUI_NAME`, custom.css, favicon vía bind mounts; parche `env.py` para el sufijo). Aloja agentes (Workspace Models), Knowledge Bases y tools.

**Asistente Náutico** (`asistente_nautico.py`, producción) — bot Telegram contra la API de Open WebUI. RAG con native function calling, system prompt corporativo inyectado en vuelo, búsqueda web (DDGS), análisis de PDFs (pymupdf), citas con fuentes reales, multilingüe.

**Asistente de Servicio** (`asistente_servicio.py`, en desarrollo) — bot Telegram para SAT (diagnóstico y gestión de servicio). Esqueleto creado; pendiente de configuración y lógica.

**Tools Open WebUI** (`proyectos/.docker/openweb/tools/`) — Python, organizadas en `stable/` (producción) y `experimental/` (prefijo `dev_`):
- `query_knowledge` — RAG custom multi-KB con citas
- `read_file` — lector universal de adjuntos (PDF, DOCX, PPTX, Excel, JSON, código)
- `generate_doc` — generación de DOCX, PDF, PPTX, Excel multi-hoja, HTML
- `calculadora` — evaluador AST seguro, estadística, conversiones, finanzas, fechas
- `read_g3` — análisis de CSV de diagnóstico Mercury G3 + tabla de 134 códigos de fallo

**tsamaps** (EOL, archivado en `.webapps/antiguos/`) — carta náutica OpenSeaMap/CartoDB con FastAPI (estáticos + proxy `/chat` hacia Open WebUI), meteorología, radar, viento, herramientas de navegación y chat IA. Sin desarrollo activo; arrancable para demos con `ops/tsamaps-demo-start.ps1`.

---

## Estructura del repositorio

```
STATUS.md                   # Estado del proyecto — actualizado al cierre de cada sesión
proyectos/
├── .backlog/               # Backlog activo (prefijo OK = implementado)
├── .claude/
│   ├── ops/                # Scripts PowerShell de operación (start/stop por servicio, demos)
│   └── commands/           # Skills de Claude Code (slash commands)
├── .docker/
│   ├── .bots/telegram/     # Bots Telegram (.py planos + requirements.txt compartido)
│   ├── branding/           # Rebrand Touron LLM (custom.css, favicon)
│   ├── certs/              # Certificados TLS (Tailscale)
│   ├── compose/            # prod.yml · dev.yml · proxy.yml · bots.yml · tools.yml
│   ├── filebrowser/        # Filebrowser inyectable (sin imagen Docker)
│   └── openweb/
│       ├── tools/          # Tools Python (stable/ y experimental/)
│       └── workflows/      # Procedimientos de operación (update_workflow.md, etc.)
├── .agents/skills/         # Skills de agentes (SKILL.md por skill)
├── .docs/                  # Documentación de servicios
├── .log/                   # Changelogs de sesión + CHANGELOG_INDEX.md
├── .shimmercloud/          # Migración Azure: plan de 5 fases + ADRs
├── .tunnel/                # Scripts legacy de exposición de servicios
└── .webapps/antiguos/      # Proyectos web EOL (tsamaps, versionado como excepción)
```

---

## Roadmap

1. **Producción en Azure** (nov 2026) — VM Linux (candidata D4as v5) en el tenant corporativo, Azure OpenAI como motor de inferencia, entornos prod/dev separados en la misma VM. Plan de 5 fases en `.shimmercloud/migracion/plan.md`.
2. **RAG SharePoint Online** — sync automático vía Microsoft Graph hacia las Knowledge Bases; embeddings duales (docs internos → `bge-m3`, manuales públicos → `text-embedding-3-large`). Diseño completo en `.backlog/rag_sharepoint/`.
3. **Add-in Microsoft Office** — task pane HTML/JS contra la API de Open WebUI, con lectura del contexto activo (correo abierto, rango Excel). Distribución vía M365 Centralized Deployment.
4. **Agentes departamentales** — diagnóstico de motores, taller de servicio, integración ERP Libra (Oracle).
