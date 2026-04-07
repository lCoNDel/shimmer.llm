# Shimmer LLM — Contexto del Proyecto

## Quién soy

**Luis Conde** — Técnico de Sistemas en **Touron S.A.** (distribuidor oficial Mercury/Brunswick/Quicksilver/Bayliner/Simrad, ~50 empleados, Torrejón de Ardoz, Madrid. Sucursal en Cascais, Portugal).

- Compañeros IT: José Sanz (Oracle/ERP), Tomás Ruiz-Roso (Big Data), Viviana Franco (Microsoft)
- ERP: **Libra** (Oracle). Microsoft 365 + SharePoint Online.
- Stack personal: Docker, Python, LLMs, algo de Next.js/JS vanilla

**Idioma de trabajo**: español siempre. Código y commits en inglés.

---

## Qué es Shimmer

Plataforma de IA local en fase de **demo y testing**, desarrollada por mí para desplegar en producción en Touron S.A. en un servidor dedicado (pendiente de adquisición de máquina).

**Núcleo**: Open WebUI + Docker + Ollama (Ollama corre en el host Windows, el resto en contenedores Docker).

---

## Stack Técnico

| Servicio | Tecnología | Puerto |
|---|---|---|
| Interfaz principal | Open WebUI v0.8.12 | 3000 (prod) / 4000 (dev) |
| Alternativa | AnythingLLM | 3001 (prod) / 4001 (dev) |
| LLM local | Ollama (host Windows) | 11434 |
| Filebrowsers | Inyectables, no permanentes | 8000–8002 |
| Carta náutica | opensea (HTML/CSS/JS) | 5050 |
| Bots | Python (Telegram) | Long polling, sin puerto |

**Ollama (host Windows):** `OLLAMA_HOST=127.0.0.1:11434`, `KEEP_ALIVE=600`, `MAX_LOADED_MODELS=3`, `NUM_PARALLEL=4`. Los contenedores se conectan vía `host.docker.internal:11434`.

---

## Estructura del Repositorio

```
shimmer.llm/
├── CLAUDE.md
├── README.md
└── proyectos/              ← working directory principal
    ├── .agents/            # Skills y agentes
    │   ├── god/            # Meta-skill para crear otras skills
    │   └── skills/         # Catálogo de skills
    │       ├── ai-engineer/
    │       ├── asesor-nautico/
    │       ├── asistente-nautico-touron/
    │       ├── blast-pilot/
    │       ├── diagnostico-motores/
    │       ├── docker-backup/
    │       ├── docker-expert/
    │       ├── mk-asesor-360/
    │       └── openweb-rebrand/
    ├── .backlog/           # Ideas y proyectos futuros (activo)
    ├── .bots/
    │   └── telegram/       # asistente_nautico.py → conectado a Open WebUI API
    ├── .docker/
    │   ├── compose/        # prod.yml, dev.yml, bots.yml, tools.yml
    │   ├── backup/
    │   ├── filebrowser/
    │   ├── puertos.md
    │   └── ollama.md
    ├── .docs/
    │   └── openwebui/
    └── .webapps/
        ├── prod/opensea/   # Carta náutica en producción
        ├── dev/opensea/    # Entorno de desarrollo
        └── antiguos/       # Archivados (excluidos de git)
```

---

## Skills (.agents/)

Cada skill vive en `.agents/skills/[nombre]/SKILL.md` con frontmatter YAML (`name`, `description`) y el cuerpo de instrucciones del agente. Al crear o modificar una skill, seguir el estándar de `.agents/god/SKILL.md`.

Skills activas:
- **asistente-nautico-touron** — Agente Shimmer para clientes de Touron. Contiene datos reales de la empresa (tratar con discreción).
- **asesor-nautico** — Asesor estratégico náutico
- **diagnostico-motores** — Diagnóstico de motores fueraborda
- **docker-expert** / **docker-backup** — Soporte operacional Docker
- **ai-engineer**, **blast-pilot**, **mk-asesor-360**, **openweb-rebrand** — Varios

---

## Backlog (.backlog/)

Backlog activo. Los archivos con prefijo `OK` están implementados.

| Proyecto | Estado |
|---|---|
| `rag_sharepoint/` | Diseñado con código, pendiente de implementar |
| `diagnostico_motores.txt` | Pendiente |
| `taller_servicio.txt` | Pendiente |
| `base_datos.txt` | Integración ERP Libra — pendiente |
| `hombre_al_agua.txt` | Pendiente |
| `rag_obsidian.txt` | Pendiente |
| `funciones_opensea.txt` | Pendiente |
| `api_acceso_teléfono.txt` | OK — implementado |
| `asistente_náutico.txt` | OK — implementado como skill |

---

## opensea (.webapps/)

App web estática (HTML/CSS/JS vanilla) — carta náutica interactiva para la red comercial de Touron S.A.

**Stack**: Leaflet 1.9.4, OpenSeaMap (tiles náuticos), CartoDB (mapa base). Sin backend propio. Se sirve con `npx http-server` en el puerto 5050.

**Funcionalidades:**
- Mapa náutico con capa OpenSeaMap (boyas, luces, marcas de navegación)
- Red de 32 distribuidores (España + Portugal) con popups completos
- Meteorología marina — clic en mapa → Open-Meteo Marine API
- GPS / Geolocalización con `watchPosition`; refresco marino cada 5 min
- SOS / Hombre al agua — fija posición, calcula distancia en tiempo real
- Alarma de fondeo
- Regla náutica
- Radar de lluvia — RainViewer API, animación multi-frame
- Tráfico marítimo — VesselFinder (iframe)
- Radio — Radio Browser API
- Búsqueda global — Nominatim (OSM)
- Responsive completo con drawers en mobile

Los changelogs en `prod/opensea/logs/` incluyen una sección "Contexto técnico para agentes" — leer antes de modificar la app.

---

## Estado Actual (abril 2026)

- **Fase**: Demo y testing en local (Windows 11)
- **Próximo paso**: Despliegue en servidor dedicado (máquina pendiente de adquisición)
- **RAG SharePoint**: Diseñado, pendiente de implementación (ver `.backlog/rag_sharepoint/`)
- **Modelo de embeddings**: Por decidir entre `nomic-embed-text` y `mxbai-embed-large`

---

## Convenciones Clave

- Responder siempre en **español**
- No modificar `.docker/compose/prod.yml` sin confirmar
- Respetar el esquema de puertos en `.docker/puertos.md`
- Al crear/modificar skills, seguir el formato de `.agents/god/SKILL.md`
- En documentación importante, preguntar antes de asumir contexto
- En tareas de código, actuar directamente
