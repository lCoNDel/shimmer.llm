# shimmer.llm

Proyecto personal de IA aplicada al negocio, desarrollado por Luis Conde para Touron S.A. — distribuidor oficial Mercury/Brunswick en España y Portugal desde 1958.

El objetivo es explorar y demostrar el uso práctico de modelos de lenguaje locales en el contexto real de una empresa náutica: atención al cliente, consulta técnica, acceso a documentación interna y automatización de tareas del día a día.

> **Estado actual:** fase de demo y testing en local (Windows). Migración a producción en Azure aprobada por gerencia (mayo 2026) — objetivo: noviembre 2026, con inferencia vía Azure OpenAI. Plan y decisiones en `proyectos/.shimmercloud/`.
>
> El estado detallado del proyecto, actualizado al cierre de cada sesión, está en [STATUS.md](STATUS.md).

---

## Por qué existe

Touron gestiona un catálogo de más de 5.000 referencias, manuales técnicos en varios idiomas, un equipo de SAT con necesidades de diagnóstico rápido y clientes que hacen consultas técnicas complejas. La IA local permite explorar soluciones a estos problemas sin depender de servicios cloud externos ni exponer datos sensibles.

---

## Qué se ha construido

**Asistente Náutico (Telegram)**
Bot de Telegram con acceso a manuales técnicos Mercury mediante RAG. Responde consultas sobre mantenimiento, códigos de error, compatibilidades y especificaciones. Incluye búsqueda web integrada, native function calling, búsqueda híbrida semántica + BM25 y soporte multilingüe.

**tsamaps** *(EOL — archivado)*
Carta náutica interactiva con OpenSeaMap y CartoDB. Permite buscar puertos y puntos de interés, y tiene chat integrado con el asistente IA directamente desde la carta. Backend en FastAPI, frontend en JS vanilla con Leaflet. Proyecto finalizado: sin desarrollo activo, se conserva como fuente de conocimiento (Leaflet, proxy FastAPI, integración de chat IA) para futuros proyectos.

**Asistente de Servicio (Telegram)** *(en desarrollo)*
Bot orientado al equipo interno de SAT para consultas de diagnóstico y gestión de servicio técnico. Estructura base creada; pendiente de configuración y lógica.

**Tools para Open WebUI**
Conjunto de herramientas Python que amplían los agentes: RAG custom sobre Knowledge Base (`query_knowledge`), lector universal de adjuntos, calculadora avanzada, generación de documentos (Word, PDF, PPTX, Excel) y análisis de CSV de diagnóstico Mercury G3 con tabla de códigos de fallo. Organizadas en `stable/` (producción) y `experimental/` (versiones `dev_` en pruebas).

**Touron LLM**
Instancia personalizada de Open WebUI con identidad corporativa Touron: paleta de color azul marino, logo y nombre propios. Sirve como interfaz principal para pruebas de modelos, RAG y workflows internos.

---

## Arquitectura

| Servicio | Tecnología | Puerto |
|---|---|---|
| Interfaz principal | Open WebUI v0.9.4 | 3000 |
| Interfaz desarrollo | Open WebUI v0.9.6 | 3002 |
| Alternativa | AnythingLLM | 3001 |
| LLM local | Ollama (host Windows) | 11434 |
| Carta náutica (EOL) | tsamaps (FastAPI + Leaflet) | 5050 (HTTPS vía Tailscale) |
| Bots | Python — Telegram Long Polling | — |
| Filebrowser | Global (puntual) / inyectable en contenedores | 8000 / 8001–8002 |

Ollama corre directamente en el host Windows. El resto de servicios en Docker. Los contenedores acceden a Ollama mediante `host.docker.internal`.

| Compose | Proyecto Docker | Servicios |
|---|---|---|
| prod.yml | 1-produccion | open-webui (3000), anything-llm (3001) |
| dev.yml | 2-desarrollo | open-webui-dev (3002) |
| proxy.yml | 3-proxy | tsamaps_server (5050) |
| bots.yml | 4-bots | asistente_nautico, asistente_servicio |
| tools.yml | — | filebrowser global (8000, uso puntual) |

---

## Estructura del repositorio

STATUS.md                   # Estado del proyecto — actualizado al cierre de cada sesión
proyectos/
├── .backlog/               # Backlog activo — ideas y proyectos futuros (prefijo OK = implementado)
├── .claude/                # Configuración Claude Code
│   ├── ops/                # Scripts PowerShell de operación (arranque, parada, etc.)
│   └── commands/           # Skills y comandos del agente
├── .docker/
│   ├── .bots/
│   │   └── telegram/
│   │       ├── asistente_nautico.py    # Bot asistente náutico
│   │       ├── asistente_servicio.py   # Bot asistente de servicio (en desarrollo)
│   │       └── requirements.txt        # Dependencias compartidas
│   ├── branding/
│   │   ├── custom.css      # Tema azul marino Touron
│   │   └── favicon.png     # Logo Touron redondeado
│   ├── certs/              # Certificados TLS (Tailscale)
│   ├── compose/
│   │   ├── prod.yml        # Open WebUI prod + AnythingLLM
│   │   ├── dev.yml         # Open WebUI dev
│   │   ├── proxy.yml       # tsamaps_server
│   │   ├── bots.yml        # Bots Telegram
│   │   └── tools.yml       # Filebrowser global
│   ├── filebrowser/        # Filebrowser inyectable (sin imagen Docker)
│   └── openweb/
│       ├── tools/
│       │   ├── stable/         # Tools en producción
│       │   └── experimental/   # Tools dev_ en pruebas
│       └── workflows/      # Procedimientos de operación (p.ej. update_workflow.md)
├── .agents/
│   └── skills/             # Skills de Claude Code (SKILL.md por skill)
├── .docs/                  # Documentación de servicios
├── .log/                   # Changelogs de sesión (changelog_YYYY-MM-DD.md + índice)
├── .shimmercloud/          # Migración a Azure: plan de 5 fases y registro de ADRs
├── .tunnel/                # Scripts legacy de exposición de servicios
└── .webapps/
    └── prod/
        └── tsamaps/        # Carta náutica — EOL, archivada como fuente de conocimiento
            ├── app.js      # Lógica frontend (Leaflet, chat, búsqueda)
            ├── index.html
            ├── index.css
            ├── responsive.css
            └── server.py   # FastAPI: estáticos + proxy /chat hacia Open WebUI
