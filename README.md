## Servicios Docker

| Compose | Proyecto Docker | Servicios |
|---|---|---|
| `prod.yml` | `1-produccion` | open-webui (3000), anything-llm (3001) |
| `dev.yml` | `2-desarrollo` | open-webui-dev (3002) |
| `proxy.yml` | `3-proxy` | tsamaps_server (5050) |
| `bots.yml` | `4-bots` | asistente_nautico, asistente_servicio |

> No arrancar `open-webui` y `open-webui-dev` simultáneamente — comparten volumen.

---

## Arranque rápido

docker compose -f proyectos/.docker/compose/prod.yml up -d
docker compose -f proyectos/.docker/compose/proxy.yml up -d
docker compose -f proyectos/.docker/compose/bots.yml up -d

---

## Desarrollos principales

- **Asistente Náutico** — Bot de Telegram con RAG sobre manuales Mercury (native function calling, búsqueda híbrida semántica + BM25, sistema de citas)
- **tsamaps** — Carta náutica interactiva con OpenSeaMap, búsqueda de puertos y chat integrado con el asistente IA
- **Asistente de Servicio** — Bot de Telegram para gestión interna de SAT
- **Touron LLM** — Rebrand de Open WebUI con identidad corporativa Touron (paleta azul marino, logo)

---

## Licencia

Uso interno — Touron S.A. © 2024-2026

