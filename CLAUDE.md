# Shimmer LLM — Contexto del Proyecto

## Qué es Shimmer

Shimmer es una plataforma de IA local en fase de **demo y testing**, con objetivo de despliegue en producción en servidor dedicado (pendiente de adquisición). Desarrollada por **Luis Conde**, Técnico de Sistemas en **Touron S.A.** (distribuidor oficial Mercury/Brunswick, ~50 empleados, Madrid).

El núcleo de la plataforma es **Open WebUI + Docker + Ollama** (Ollama corre en el host Windows, los demás servicios en contenedores Docker).

**Idioma de trabajo**: español por defecto. El código, commits y nombres técnicos pueden estar en inglés.

---

## Estructura del Repositorio

```
shimmer.llm/
│
├── CLAUDE.md           # Este archivo
├── README.md
├── LICENSE
│
└── proyectos/          # Working directory de Claude Code
    ├── CLAUDE.md
    ├── .backlog/       # Ideas y proyectos futuros (ACTIVO)
    ├── .bots/          # Bots de mensajería (Telegram, WhatsApp...)
    ├── .claude/        # Configuración local de Claude Code (no editar)
    ├── .docker/        # Infraestructura Docker
    ├── .docs/          # Documentación de aplicaciones/servicios
    ├── .agents/           # Sistema de skills y agentes
    └── .webapps/       # Proyectos web paralelos
```

---

## Stack Técnico

| Servicio | Tecnología | Puerto |
|---|---|---|
| Interfaz principal | Open WebUI v0.8.12 | 3000 (prod) / 4000 (dev) |
| Alternativa | AnythingLLM | 3001 (prod) / 4001 (dev) |
| LLM local | Ollama (host Windows) | 11434 |
| Acceso a archivos | Filebrowser | 8000–8002 |
| Bots | Python (Telegram, WhatsApp) | Sin puerto (Long Polling) |

Esquema completo de puertos: [docs/puertos.md](docs/puertos.md)

---

## Detalle de Carpetas en `proyectos/`

### `.backlog/` — Ideas y proyectos futuros
Backlog activo. Los archivos con prefijo `OK` son ideas ya implementadas.

| Proyecto | Estado |
|---|---|
| `rag_sharepoint/` | Diseñado, pendiente de implementar |
| `diagnostico_motores.txt` | Pendiente |
| `taller_servicio.txt` | Pendiente |
| `base_datos.txt` | Integración ERP Libra — pendiente |
| `hombre_al_agua.txt` | Pendiente |
| `rag_obsidian.txt` | Pendiente |
| `funciones_opensea.txt` | Pendiente |
| `api_acceso_teléfono.txt` | OK — implementado |
| `asistente_náutico.txt` | OK — implementado como skill |

### `.bots/` — Bots de mensajería
```
.bots/
└── telegram/
    ├── asistente_nautico.py    # Bot conectado a la API de Open WebUI
    └── requirements.txt
```
Nuevos bots se organizan en subcarpetas por plataforma: `telegram/`, `whatsapp/`, etc.

### `.docker/` — Infraestructura Docker
```
.docker/
├── compose/
│   ├── prod.yml        # Stack producción (Open WebUI + AnythingLLM)
│   ├── dev.yml         # Entorno de desarrollo
│   ├── bots.yml        # Contenedores de bots
│   └── tools.yml       # Herramientas auxiliares
├── backup/             # Scripts de backup de contenedores y volúmenes
├── filebrowser/        # Scripts de inyección de Filebrowser (lanzamiento manual)
├── puertos.md          # Esquema estándar de puertos de todos los servicios
└── ollama.md           # Cómo se comunica Ollama (host Windows) con los contenedores
```
Los Filebrowsers son inyectables: se lanzan puntualmente para acceder a los archivos internos de los contenedores, no corren de forma permanente.

### `.docs/` — Documentación de servicios
```
.docs/
└── openwebui/          # Notas, changelogs y guías de Open WebUI
```

### `.agents/` — Sistema de skills
```
.agents/
├── god/                    # Meta-skill: crea otras skills
└── skills/
    ├── ai-engineer/
    ├── asesor-nautico/             # Asesor estratégico náutico Touron
    ├── asistente-nautico-touron/   # Agente Shimmer para clientes de Touron
    ├── blast-pilot/
    ├── diagnostico-motores/
    ├── docker-backup/
    ├── docker-expert/
    ├── mk-asesor-360/
    └── openweb-rebrand/            # Rebrand de la interfaz Open WebUI
```

Formato de una skill:
```
.agents/skills/[nombre]/
└── SKILL.md    # Frontmatter: name, description. Cuerpo: instrucciones del agente
```
Al crear o modificar skills, seguir el estándar de `.agents/god/SKILL.md`.

### `.webapps/` — Proyectos web paralelos
Proyectos que surgen del ecosistema Shimmer pero son independientes de la plataforma:
```
.webapps/
├── prod/
│   └── tsamaps/    # Producción (puerto 5050 local)
├── dev/
│   └── tsamaps/    # Desarrollo
└── antiguos/       # Proyectos archivados — excluidos de git (.gitignore)
```

#### tsamaps
App web estática (HTML/CSS/JS) — carta náutica interactiva orientada a la red comercial de Touron S.A.

**Stack**: HTML + CSS + JS vanilla, Leaflet 1.9.4, OpenSeaMap (tiles náuticos), CartoDB (mapa base). Sin backend propio.
**Archivos principales**: `app.js`, `index.html`, `index.css`, `responsive.css`.
Todo el JS vive en un único `document.addEventListener('DOMContentLoaded', async () => { ... })`.
Sirve en local con `npx http-server` en el puerto 5050.

**Funcionalidades:**
- **Mapa náutico** — capa OpenSeaMap (boyas, luces, marcas de navegación) sobre CartoDB
- **Red de distribuidores** — 32 distribuidores de Touron S.A. (España + Portugal) con popups: dirección, teléfono (`tel:`), email, web, descripción
- **Meteorología marina** — clic en el mapa consulta Open-Meteo Marine API: altura de oleaje, dirección, periodo, ola de viento, temperatura superficial. Actualización en-place sin parpadeo cuando el GPS está activo
- **GPS / Geolocalización** — seguimiento en tiempo real con `watchPosition`; refresco de condiciones marinas cada 5 min aunque el barco no se mueva
- **SOS / Hombre al agua** — fija posición del incidente, calcula distancia en tiempo real; bloquea el resto de herramientas mientras está activo
- **Alarma de fondeo** — alerta si el barco se aleja del punto de fondeo; se engancha a `watchPosition` sin polling propio
- **Regla náutica** — mide distancias sobre el mapa
- **Radar de lluvia** — animación multi-frame (pasado + nowcast) vía RainViewer API con HUD de control
- **Tráfico marítimo** — integración con VesselFinder (iframe)
- **Radio** — integración con Radio Browser API
- **Búsqueda global** — geocodificación con autosugerencias vía Nominatim (OSM)
- **Responsive completo** — drawers deslizables en mobile, swipe-to-close, buscador flotante, lógica exclusiva de herramientas

**Changelogs**: `prod/tsamaps/logs/` — cada entrada incluye una sección "Contexto técnico para agentes" con referencias exactas a funciones, archivos y variables. Leer antes de modificar la app.

---

## Contexto Empresarial: Touron S.A.

- Distribuidor oficial de Mercury, Quicksilver, Bayliner, Simrad, etc.
- ~50 empleados. Sede: Torrejón de Ardoz, Madrid. Sucursal: Cascais, Portugal.
- ERP: **Libra** (Oracle). Microsoft 365 + SharePoint Online.
- Luis Conde es Técnico de Sistemas. Compañeros IT: José Sanz (Oracle), Tomás Ruiz-Roso (Big Data), Viviana Franco (Microsoft).
- La skill `asistente-nautico-touron` contiene datos reales de la empresa — tratar con discreción.

---

## Estado del Proyecto

- **Fase actual**: Demo y testing en local (Windows)
- **Próximo paso**: Despliegue en servidor dedicado (pendiente de adquisición de máquina)
- **RAG SharePoint**: Diseñado, pendiente de implementación → ver `.backlog/rag_sharepoint/`
- **Modelo de embeddings**: Por decidir (`nomic-embed-text` o `mxbai-embed-large` como candidatos)
