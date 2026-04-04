# Esquema de Puertos — Shimmer LLM

Este documento define el estándar de puertos para todos los servicios del proyecto. El objetivo es mantener un orden lógico y evitar colisiones a medida que el sistema escale.

## Bloque 3000 — Interfaces y Producción

Interfaces principales utilizadas en el día a día.

| Puerto | Servicio |
|---|---|
| 3000 | Open WebUI (Producción) |
| 3001 | AnythingLLM (Producción) |
| 3002–3099 | Reservado (LibreChat, Flowise, etc.) |

## Bloque 4000 — Entornos de Desarrollo y Pruebas

Clones inestables de producción para experimentos.

| Puerto | Servicio |
|---|---|
| 4000 | Open WebUI (Dev) |
| 4001 | AnythingLLM (Dev) |
| 4002–4099 | Reservado para futuros contenedores experimentales |

## Bloque 5000 — APIs y Servicios Backend

Servicios sin interfaz visual accesible.

| Puerto | Servicio |
|---|---|
| 5000–5099 | APIs nativas, webhooks, microservicios, puentes de IA |

## Bloque 8000 — Herramientas de Gestión y Monitoreo

Servicios de administración interna.

| Puerto | Servicio |
|---|---|
| 8000 | Filebrowser Global (acceso raíz a todo el árbol) |
| 8001 | Filebrowser Inyectable → Open WebUI |
| 8002 | Filebrowser Inyectable → AnythingLLM |
| 8003–8099 | Reservado (Grafana, Portainer, etc.) |

## Bots y Asistentes

Los bots de arquitectura Long Polling (Telegram, WhatsApp, Discord) se conectan externamente y **no requieren exponer puertos** en la máquina local, salvo que se implemente una arquitectura de webhooks (usaría el Bloque 5000).

## Bases de Datos y Caché

Siempre en sus puertos estándar/oficiales para facilitar identificación técnica rápida.

| Puerto | Servicio |
|---|---|
| 11434 | Ollama (Host Windows) |
| 5432 / 5433 | PostgreSQL |
| 6379 | Redis |
