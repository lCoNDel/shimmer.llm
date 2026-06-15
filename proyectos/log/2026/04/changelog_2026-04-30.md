# Changelog — 2026-04-30

## tsamaps — Backlog: nuevas ideas de funcionalidad

### Exploración de funciones adicionales

Sesión de planificación y exploración. Se realizó:
- Auditoría completa del backlog existente cruzada con el código de `app.js` para identificar qué ya estaba implementado
- Búsqueda de ideas de nuevas funcionalidades náuticas con APIs gratuitas disponibles

**Resultado de la auditoría del backlog:**

| Archivo | Estado |
|---|---|
| `hombre_al_agua.txt` | IMPLEMENTADO — MOB completo con deep links WhatsApp y Telegram |
| `hob_compartir_posicion.txt` | IMPLEMENTADO — deep link WhatsApp con coordenadas preformateadas |
| `funciones_opensea.txt` | PARCIAL — amanecer/anochecer (SunCalc) y waypoints (localStorage) implementados; SOG y modo nocturno pendientes |

### Nuevos archivos de backlog añadidos

| Archivo | Idea |
|---|---|
| `tsamaps_calculadora_ruta.txt` | Calculadora de ruta náutica: waypoints + ETA + consumo de combustible. Sin API, cálculo Haversine local. |
| `tsamaps_alertas_meteorologicas.txt` | Alertas automáticas por viento/ola sobre umbral configurable. Open-Meteo (ya en uso). |
| `tsamaps_declinacion_magnetica.txt` | Declinación magnética en la regla náutica via NOAA World Magnetic Model (gratuita). |
| `tsamaps_tracking_tiempo_real.txt` | Compartir posición en tiempo real con enlace único. WebSocket FastAPI o polling HTTP. |

---

## tsamaps dev — Runtime actualizado (start.ps1 / stop.ps1)

### Cambio

Los scripts `start.ps1` y `stop.ps1` del runtime de tsamaps dev ahora gestionan los tres servicios necesarios para la sesión de desarrollo completa, no solo `tsamaps_server_dev`.

**start.ps1 — antes:** solo levantaba `tsamaps_server_dev` (proxy.yml)
**start.ps1 — ahora:** levanta en orden:
1. `open-webui` → `prod.yml`
2. `asistente_nautico` → `bots.yml`
3. `tsamaps_server_dev` → `proxy.yml`
4. Abre túnel ngrok en puerto 5050

**stop.ps1** — para los tres contenedores en orden inverso y cierra ngrok.

`Runtime.md` actualizado para reflejar los nuevos servicios gestionados.

---

## CLAUDE.md — Versión Open WebUI corregida

- `Open WebUI v0.8.12` → `v0.9.2`

---

## Documento memoria.html (OneDrive — fuera de git)

Ediciones sobre `IT - Documentos/PROYECTOS/SISTEMAS/Plataforma LLM & RAG/00_memoria.html`:

- Eliminada la sección `<h4>Componentes principales de la plataforma</h4>` y la tabla asociada (filas: Ollama/vLLM, Docker, Open WebUI, AnythingLLM, Acceso vía mensajería)
- Eliminado separador `<hr class="sep">` duplicado que quedaba entre la sección RAG y TSA Maps (había dos seguidos con un comentario `<!-- BOTS -->` vacío entre ellos)

---

## Contexto técnico para agentes

**Archivos modificados (git):**
- `.webapps/dev/tsamaps/runtime/start.ps1` — ahora levanta prod.yml + bots.yml + proxy.yml en ese orden
- `.webapps/dev/tsamaps/runtime/stop.ps1` — para los tres compose en orden inverso
- `.webapps/dev/tsamaps/Runtime.md` — descripción actualizada de los servicios gestionados
- `CLAUDE.md` — versión Open WebUI corregida a v0.9.2

**Archivos nuevos (git — backlog):**
- `.backlog/tsamaps_calculadora_ruta.txt`
- `.backlog/tsamaps_alertas_meteorologicas.txt`
- `.backlog/tsamaps_declinacion_magnetica.txt`
- `.backlog/tsamaps_tracking_tiempo_real.txt`

**Archivo editado fuera de git (OneDrive):**
- `C:\Users\luisc\OneDrive - TOURON, S.A\IT - Documentos\PROYECTOS\SISTEMAS\Plataforma LLM & RAG\00_memoria.html`

**Runtime tsamaps dev — orden de arranque:**
```
start.ps1:
  1. docker compose -f prod.yml up -d open-webui
  2. docker compose -f bots.yml up -d asistente_nautico
  3. docker compose -f proxy.yml up -d tsamaps_server_dev
  4. ngrok http 5050

stop.ps1:
  1. docker compose -f proxy.yml stop tsamaps_server_dev
  2. docker compose -f bots.yml stop asistente_nautico
  3. docker compose -f prod.yml stop open-webui
  4. Stop-Process ngrok
```
