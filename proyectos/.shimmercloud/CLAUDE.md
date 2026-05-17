# Shimmer Cloud — Contexto del Proyecto

## Qué es este directorio

`.shimmercloud/` contiene todo lo relativo al despliegue de Shimmer en Azure cloud.
Es el sucesor del entorno local (Windows 11 + Docker Desktop + Ollama) que está actualmente en uso.

Este `CLAUDE.md` es el punto de entrada para cualquier sesión de trabajo sobre la migración.
Leerlo siempre antes de empezar.

---

## Estado del proyecto

- **Fase**: Planificación — arquitectura en definición
- **Aprobación**: Gerencia Touron S.A. — mayo 2026
- **Objetivo**: Shimmer en producción real en el tenant Azure de Touron
- **Fecha objetivo**: noviembre 2026

---

## Decisiones confirmadas

| Decisión | Detalle |
|---|---|
| Plataforma cloud | Azure — tenant corporativo de Touron S.A. |
| Inferencia LLM | Azure OpenAI API — Ollama desaparece completamente |
| SO del servidor | Linux |
| Embeddings (manuales públicos) | `text-embedding-3-large` (Azure OpenAI) |
| Embeddings (docs internos) | `bge-m3` |

---

## Entornos

Dos entornos completamente separados en la misma VM, cada uno con sus propios contenedores y volúmenes:

| Entorno | Uso |
|---|---|
| **Producción** | Usuarios reales de Touron — estable, sin experimentos |
| **Desarrollo / Testing** | Pruebas, nuevas features, validación antes de subir a prod |

La separación es total — volúmenes independientes, contenedores independientes.
Mismo modelo que el entorno local actual (prod.yml / dev.yml), pero en la VM Azure.

---

## Decisiones pendientes

| Decisión | Opciones / Notas |
|---|---|
| Modelo LLM para inferencia | Por decidir — familia GPT-4o probable |
| Interfaz de usuario | Open WebUI en Azure u otra plataforma — por confirmar |
| Tipo de recurso Azure | VM Linux — candidata D4as v5 (4 vCPU, 16 GB RAM, AMD EPYC), no confirmada |
| Region Azure | Por confirmar (West Europe recomendado para latencia desde Madrid) |
| RAG SharePoint | Piloto prioritario una vez el entorno base esté operativo |

---

## Entorno actual (origen de la migración)

El entorno que se está migrando está documentado en `../CLAUDE.md` (directorio `proyectos/`).
No duplicar información que ya esté allí.

Resumen de lo relevante para la migración:

- **Open WebUI v0.9.4** con tools Python, Knowledge Base (ChromaDB), branding Touron
- **Bot Telegram** (`asistente_nautico.py`) — long polling, ciclo de tool calls, RAG
- **tsamaps** — app web FastAPI + Leaflet, chat integrado contra Open WebUI
- **Tools activas**: `query_knowledge.py`, `web_search.py`, `calculadora.py`, `read_file.py`, `read_g3.py`, `generate_doc.py`
- **Knowledge Base**: Manuales Mercury, embeddings bge-m3, ChromaDB interno de Open WebUI

---

## Estructura de este directorio

```
.shimmercloud/
├── CLAUDE.md           # Este archivo — leer siempre primero
├── arquitectura/       # Diagramas y decisiones de arquitectura
├── infraestructura/    # IaC, Bicep/Terraform, configuración Azure
├── migracion/          # Plan de migración paso a paso
└── servicios/          # Configuración de cada servicio en el nuevo entorno
```

> Las carpetas se irán creando conforme avance el proyecto. No crear estructura vacía por adelantado.

---

## Requisitos de acceso para Claude Code

El soporte de despliegue y operación se hará con Claude Code con acceso directo a la VM.
Esto es un requisito de infraestructura — debe estar listo antes de empezar el despliegue.

| Requisito | Detalle |
|---|---|
| VS Code + Remote - SSH | Extensión Remote - SSH apuntando a la VM Azure |
| Claude Code en la VM | Instalado vía npm (requiere Node.js) — autenticación con cuenta claude.ai, igual que en local |
| Acceso al repo | Git configurado en la VM con acceso al repositorio |
| Usuario | Sin root — usuario con sudo para operaciones Docker y sistema |

Flujo de trabajo previsto: Luis conecta a la VM con VS Code Remote - SSH → abre Claude Code en el terminal integrado → sesión de trabajo directamente sobre el entorno cloud.

---

## Convenciones

- **Idioma**: español siempre, salvo código o contexto técnico.
- **No copiar del entorno local** configuración que no sea portable — identificar qué cambia y qué se reutiliza.
- **Ollama no existe** en este entorno. Cualquier referencia a `host.docker.internal:11434` o a modelos Ollama es legacy del entorno local.
- **Cada decisión técnica tomada** se registra aquí en la sección "Decisiones confirmadas" antes de implementarse.
