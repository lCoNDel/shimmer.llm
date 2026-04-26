# Changelog — 2026-04-26

## tsamaps dev — Capa de viento en tiempo real (Open-Meteo)

### server.py — generación automática de wind-global.json
- Reemplazado el JSON estático de 2016 (datos GFS demo) por datos en tiempo real de Open-Meteo
- Nueva función async `fetch_wind_data()`: construye rejilla España+Portugal (34–44°N, -12–5°E, paso 0.5°), llama a Open-Meteo con todos los puntos en una única petición, convierte velocidad+dirección a componentes U/V, escribe `wind-global.json` en formato Leaflet-Velocity
- Nueva función `wind_update_loop()`: actualiza cada hora (`WIND_UPDATE_INTERVAL = 3600`)
- `@app.on_event("startup")` lanza `asyncio.create_task(wind_update_loop())` — primera descarga al arrancar el contenedor
- Nuevo endpoint `GET /wind-timestamp` — devuelve `{"updated": "DD/MM/YYYY HH:MM UTC"}` desde `wind-timestamp.json`
- Constantes de rejilla: `GRID_LAT1=34, GRID_LAT2=44, GRID_DX=0.5`, `GRID_LON1=-12, GRID_LON2=5, GRID_DY=0.5`

### app.js — capa de viento refactorizada
- `WIND_COLOR_SCALE`: array de 15 entradas con color, rango en kt y etiqueta Beaufort (Calma → Borrasca)
- `WIND_BOUNDS`: `L.latLngBounds([[34.0,-12.0],[44.0,5.0]])` — límites de la rejilla
- `applyWindClip()`: calcula `clip-path: polygon(...)` sobre el canvas `.velocity-overlay` según la proyección actual del mapa
- `showWindLegend(timestamp)` / `hideWindLegend()`: leyenda lateral con colores, rangos kt y timestamp de última actualización
- Al activar: `Promise.all([fetch('wind-global.json'), fetch('wind-timestamp')])` en paralelo; `setTimeout(applyWindClip, 100)` + `map.on('move zoom viewreset', applyWindClip)` para recortar en cada movimiento
- `isWindLayerLoading` flag: evita race condition al activar/desactivar rápidamente (guard `if (!isWindLayerLoading) return` tras el `await`)
- `speedUnit: 'kt'` — display interno de Leaflet-Velocity alineado con la leyenda (antes: `'k/h'`)
- `colorScale`: derivado de `WIND_COLOR_SCALE.map(e => e.color)` — fuente única de verdad

### Recorte geográfico — solución al pintado global
- Leaflet-Velocity ignora los panes de Leaflet y extiende partículas fuera de los límites de la rejilla
- Solución: CSS `clip-path: polygon(...)` aplicado directamente sobre el canvas `.velocity-overlay`
- En móvil el recorte funcionaba de forma nativa (viewport más pequeño); en desktop sin clip pintaba todo el mundo
- `setTimeout(100ms)` necesario porque el canvas no está en el DOM inmediatamente tras `velocityLayer.addTo(map)`

---

## tsamaps dev — MOB: bloqueo completo de herramientas

### Eliminación de `isSosLocked()`
- Función eliminada completamente — mostraba `alert()` nativo que bloqueaba el hilo y generaba mala UX
- Todos los usos (`isSosLocked()`) reemplazados por `if (isSosActive) return;` — bloqueo silencioso
- Herramientas bloqueadas durante MOB: radio, tráfico marítimo, radar, regla náutica, alarma fondeo, buscador móvil, condiciones marítimas (apertura directa y via GPS shortcut), Sol/Luna, chat, guía de uso, modal de información, logo Touron (previene navegación externa)

### activateSos() — cierre sin pasar por listeners
- Al activar MOB con viento activo: manipulación directa de estado (`isWindLayerActive=false`, `map.removeLayer`, `windLayerBtn.classList.remove('active')`) en lugar de `windLayerBtn.click()` — evita que el guard `isSosActive` en el propio listener bloqueara el cierre
- Sin toasts al cerrar herramientas durante la activación de MOB

### Panel de seguimiento MOB — mejoras UI
- Título: "MOB ACTIVO" (antes: "S.O.S. ACTIVO")
- Distancia a víctima en millas náuticas (`distNM.toFixed(2) NM`); fallback a metros si `distNM < 0.1`
- Coordenadas copiadas automáticamente al portapapeles al activar; toast con `showToastAt()` posicionado bajo el panel, duración 6200ms, font-size aumentado
- Botones de emergencia: Salvamento primero, 112 debajo; detecta aguas ES/PT con `isInPortugueseWaters()`
- `showToastAt()` extendido: nuevos parámetros `duration = 3100` y `extraStyle = ''`

### Eliminación de toasts de desactivación
- Eliminados todos los `showToast('X desactivado/a')` al cambiar entre herramientas — solo se mantienen los de activación y errores
- Excepción: MOB sigue mostrando toast de coordenadas copiadas

---

## tsamaps dev — Revisión y limpieza de código

### Código huérfano eliminado
- Comentario duplicado `// 2.` en `activateSos()` — fusionado en uno
- Comentario de borrador `// Add a danger class if you have one, or configure CSS` en `toggleAnchorBtn` — eliminado
- Comentario inline en `search_web` — eliminado

### index.html
- `rulerBtn` tooltip: "Regla Náutica" (eliminado el paréntesis con descripción)
- `windLayerBtn` tooltip: "Capa de Viento" (eliminado "(GFS)")
- Wind layer help text: "datos Open-Meteo. Cobertura España y Portugal"
- `id="brandLogoLink"` añadido al anchor del logo Touron

### index.css
- `#wind-legend`: `position: absolute; top: 50%; left: 16px; transform: translateY(-50%)` — leyenda centrada verticalmente en el lateral izquierdo del mapa
- `#sos-tracking-panel a[href^="tel"]`: estilos de botón de llamada con `:active` scale

### responsive.css
- `.floating-alarm-panel.closed { position: fixed }` — fix animación de cierre en móvil (solapamiento con `position: absolute` de desktop que rompía el `translateY`)
- `.sos-tracking-panel` en móvil: `left: 12px; right: 12px; width: auto; transform: none`
- `#wind-legend` en móvil: `left: 12px; right: auto`

### Regla náutica — feedback móvil
- `showToolLabel(rulerBtn)` reemplazado por `showToast('Regla Náutica activada')` — aparece inmediatamente al pulsar el botón en móvil (antes requería tocar el mapa para que el tooltip CSS apareciera)

---

## tsamaps dev — Corrección de bugs de UI

### Red Náutica — panel de distribuidores
- Al seleccionar un distribuidor de la lista, el panel de condiciones marítimas no se restauraba aunque estuviera abierto antes de abrir Red Náutica. Causa: `closeSearchPanel()` en el click del card no tenía en cuenta `weatherWasOpen`. Añadido `if (weatherWasOpen) weatherPanel.classList.remove('closed')` en el handler del card (antes solo estaba en el botón X).
- Al seleccionar un distribuidor, la mitad derecha del mapa quedaba sin renderizar. Causa: Leaflet no recibía notificación del cambio de tamaño del contenedor al cerrar el panel. Añadido `map.invalidateSize({ animate: true })` tras cerrar el panel desde el card.

### Radar de lluvia (RainViewer)
- Las nubes desaparecían a mitad de la barra de progreso en PC. Causa: el timeout de 400ms para eliminar la capa anterior era insuficiente en desktop (viewport mayor = más tiles a cargar). Solución: la nueva capa arranca con `opacity: 0` y solo se hace visible al evento `load` de Leaflet, eliminando entonces la capa anterior con 200ms de margen.
- Las nubes desaparecían al acercar el zoom. Causa: `RADAR_MAX_ZOOM = 7` pero RainViewer solo sirve tiles hasta zoom 6 — Leaflet pedía tiles inexistentes y recibía 404. Solución: `RADAR_MAX_ZOOM` bajado a 6, tile layer con `maxNativeZoom: 6, maxZoom: 18` — Leaflet escala los tiles de zoom 6 al hacer zoom in en lugar de pedir tiles inexistentes.
- Eliminado el bloqueo de zoom del mapa durante el radar (`setMinZoom/setMaxZoom` al activar/desactivar, listener `zoomend`, función `warnRadarZoomLocked` y sus 4 event listeners). Ya no es necesario con `maxNativeZoom`.

### VesselFinder — botón Cerrar
- En PC, el botón "Cerrar Vessel Finder" se solapaba con la alerta MOB. Subido de `bottom: 30px` a `bottom: 120px` en `index.html`.

### Responsive — botones inferiores
- **iPad (769px–1024px)**: el botón MOB quedaba centrado horizontalmente con mucho espacio vacío a la derecha. Añadido breakpoint tablet que mueve el MOB a `right: 60px; bottom: 20px` para alinearlo con los botones del bottom-left.
- **iPhone 12 y pantallas ≤430px**: el último botón de la barra inferior (buscador) se solapaba con el botón MOB. Añadido breakpoint `max-width: 430px` que reduce botones a 34×34px, gap a 5px y margen izquierdo a 8px.

---

## skills / log — Índice de changelogs (CHANGELOG_INDEX.md)

### Motivación
Los changelogs acumulan sesiones y el agente tenía que leer documentos completos para encontrar contexto relevante. Un índice centralizado permite recuperar solo lo necesario con un grep.

### CHANGELOG_INDEX.md
- Nuevo archivo `.log/CHANGELOG_INDEX.md` — tabla Markdown con una fila por sección `##` de cada changelog
- Columnas: `Fecha | Área | Tags | Resumen | Archivo`
- Orden cronológico inverso (lo más reciente primero)
- Retroalimentado con todos los changelogs existentes (2026-03-11 → 2026-04-26), 63 entradas
- Flujo de uso: `grep "radar" CHANGELOG_INDEX.md` → leer solo el archivo indicado en la columna `Archivo`

### Skill fin-sesion actualizada
- Añadido **Paso 4** al flujo: actualizar `CHANGELOG_INDEX.md` al cierre de cada sesión
- Una fila por sección `##` nueva, insertada al principio de la tabla
- Tags derivados del contenido: funciones, componentes, plataformas, tipo de cambio

---

## tsamaps dev — Excluir JSON de viento de git

- `wind-global.json` y `wind-timestamp.json` se regeneran cada hora → git los detectaba como modificados constantemente
- Creado `.webapps/dev/tsamaps/.gitignore` con ambos archivos excluidos
- Desindexados del historial git con `git rm --cached` (los archivos permanecen en disco)

---

## Contexto técnico para agentes

> Archivos modificados: `.webapps/dev/tsamaps/app.js`, `.webapps/dev/tsamaps/server.py`, `.webapps/dev/tsamaps/index.css`, `.webapps/dev/tsamaps/index.html`, `.webapps/dev/tsamaps/responsive.css`, `.agents/skills/fin-sesion/SKILL.md`
> Archivos nuevos: `.log/CHANGELOG_INDEX.md`, `.webapps/dev/tsamaps/.gitignore`
> Archivos excluidos de git (runtime): `.webapps/dev/tsamaps/wind-global.json`, `.webapps/dev/tsamaps/wind-timestamp.json`

### Capa de viento — arquitectura completa
```
server.py startup → wind_update_loop() cada 3600s
  → fetch_wind_data() → Open-Meteo API (rejilla 34–44N, -12–5E, paso 0.5°)
  → convierte (speed, direction) → (U, V)
  → escribe wind-global.json (formato Leaflet-Velocity GRIB2)
  → escribe wind-timestamp.json {"updated": "DD/MM/YYYY HH:MM UTC"}

frontend: windLayerBtn.click()
  → Promise.all([fetch('wind-global.json'), fetch('wind-timestamp')])
  → L.velocityLayer({ colorScale: WIND_COLOR_SCALE.map(e=>e.color), speedUnit:'kt', ... })
  → setTimeout(applyWindClip, 100) + map.on('move zoom viewreset', applyWindClip)
  → showWindLegend(tsRes.updated)
```

### applyWindClip — recorte geográfico
```javascript
// WIND_BOUNDS = L.latLngBounds([[34.0,-12.0],[44.0,5.0]])
function applyWindClip() {
    const canvas = document.querySelector('.velocity-overlay');
    if (!canvas) return;
    const topLeft = map.latLngToContainerPoint(WIND_BOUNDS.getNorthWest());
    const bottomRight = map.latLngToContainerPoint(WIND_BOUNDS.getSouthEast());
    canvas.style.clipPath = `polygon(${topLeft.x}px ${topLeft.y}px, ...)`;
}
```

### MOB — isSosActive como guard universal
```javascript
// Patrón en todos los listeners de herramientas:
if (isSosActive) return;

// En activateSos(): viento se cierra sin pasar por el listener
if (isWindLayerActive || isWindLayerLoading) {
    if (velocityLayer) { map.removeLayer(velocityLayer); velocityLayer = null; }
    windLayerBtn.classList.remove('active');
    isWindLayerActive = false;
    isWindLayerLoading = false;
}
```

### showToastAt() — firma extendida
```javascript
function showToastAt(message, topPx, duration = 3100, extraStyle = '')
// Uso en MOB:
showToastAt('Coordenadas copiadas al portapapeles', topPx, 6200, 'font-size: 1.1rem; padding: 12px 20px;');
```
