# Changelog — 2026-03-31

## Radar de lluvia
- Animación multi-frame: carga frames históricos (`radar.past`) y de pronóstico (`radar.nowcast`) de la API de RainViewer
- HUD de animación: muestra hora del frame actual, etiqueta `PASADO` / `AHORA` / `PRONÓSTICO` y barra de progreso con marcador de inicio de pronóstico
- Controles del HUD: botones ← → para navegar frame a frame, botón ⏸/▶ para pausar/reanudar
- Transición entre frames sin parpadeo: la capa anterior permanece visible 400ms mientras cargan los tiles de la nueva
- Velocidad de animación: 1 segundo por frame

## GPS — Bloqueo de click
- Al activar el GPS, el botón cambia a color ámbar con animación de pulso (`gpsGlow`)
- Mensaje informativo bajo el botón con icono de candado: "El click en el mapa está bloqueado por el GPS"
- El click en el mapa también se bloquea al activar la regla náutica (mismo comportamiento que con GPS)

## Banner de permisos (primera visita)
- Modal centrado que aparece automáticamente en la primera visita solicitando permisos de GPS y notificaciones
- Lista estructurada con descripción del uso de cada permiso
- Nota informativa recomendando seleccionar "Permitir siempre" en el diálogo del navegador
- Geolocalización se solicita antes que notificaciones para respetar el contexto de gesto del usuario
- Se almacena en `localStorage` para no volver a mostrarse tras la primera interacción

## Correcciones
- Eliminado el visualizador de ondas de audio del reproductor de radio (`radioVisualizer`, `.audio-waves`, `@keyframes soundWave`) — código muerto sin efecto en la UI

---

## Contexto técnico para agentes

> Stack: HTML + CSS + JS vanilla, Leaflet 1.9.4, OpenSeaMap, RainViewer API, Nominatim.
> Archivos principales: `app.js`, `index.html`, `index.css` en `.webapps/opensea_dev/`.
> Todo el JS está dentro de un único `document.addEventListener('DOMContentLoaded', async () => { ... })`.

### Radar de lluvia — Animación multi-frame
**Archivos:** `app.js` (sección `// 9.5. radar de lluvia`), `index.html` (`#radarHud`), `index.css` (`.radar-hud`)

- La función `getRainViewerFrame()` fue reemplazada por `getRainViewerFrames()`, que ahora obtiene todos los frames de `data.radar.past` y `data.radar.nowcast` de `https://api.rainviewer.com/public/weather-maps.json`
- Cada frame tiene la forma `{ host, path, time, type: 'past'|'nowcast' }`
- La URL de tiles se construye como `${host}${path}/256/{z}/{x}/{y}/6/1_1.png`
- Variables de estado: `radarFrames[]`, `radarAnimIndex`, `radarAnimInterval`, `radarAnimPlaying`, `radarLayer`, `radarLayerPrev`
- `radarShowFrame(index)`: mantiene la capa anterior (`radarLayerPrev`) visible 400ms mientras cargan los tiles de la nueva, evitando parpadeo. La limpieza de ambas capas está en `radarStopAnim()`
- Velocidad de animación: 1000ms por frame (`setInterval`)
- **HUD** (`#radarHud`): muestra `#radarHudTime`, `#radarHudLabel` (PASADO/AHORA/PRONÓSTICO), `#radarHudProgress`, `#radarHudDivider` (marca inicio de nowcast), controles `#radarPrevBtn`, `#radarNextBtn`, `#radarPlayPauseBtn`
- El HUD se posiciona `top: 80px` centrado sobre el mapa (`z-index: 1050`)
- Zoom máximo mientras el radar está activo: 7 (`RADAR_MAX_ZOOM`)

### GPS — Feedback de bloqueo de click
**Archivos:** `app.js` (listener de `geoBtn`), `index.html` (`#gpsLockMsg`), `index.css` (`.btn-primary.active`, `@keyframes gpsGlow`)

- Al activar GPS: `geoBtn` añade clase `.active` → color ámbar (`#e67e22`) + animación `gpsGlow` (pulso)
- `#gpsLockMsg`: párrafo oculto por defecto bajo el botón GPS; se muestra/oculta con `.hidden` al activar/desactivar
- El click en el mapa (`map.on('click', ...)`) está bloqueado con `if (isTrackingActive || isRulerActive) return` — bloquea tanto GPS como regla náutica activos

### Banner de permisos (primera visita)
**Archivos:** `app.js` (sección final del DOMContentLoaded), `index.html` (`#permissionsBanner`), `index.css` (`.permissions-banner`, `.permissions-banner-card`, `.permissions-list`, `.permissions-tip`)

- Se muestra solo si `localStorage.getItem('permissionsBannerSeen')` es falsy y algún permiso está en estado `'prompt'`
- Aparece con 800ms de delay tras cargar la página
- `requestPermissions()`: llama primero a `navigator.geolocation.getCurrentPosition()` (antes de cualquier `await`) y luego a `Notification.requestPermission()` — el orden es crítico para que el navegador asocie ambas llamadas al gesto del usuario
- Botón "Continuar sin permisos" (`#permissionsDismissBtn`) también guarda `permissionsBannerSeen` sin solicitar permisos
- Card: fondo blanco sólido, `max-width: 700px`, overlay oscuro `rgba(1,10,25,0.85)` que cubre toda la pantalla

### Correcciones
- Eliminado el visualizador de ondas de audio del reproductor de radio: `const radioVisualizer`, las 3 llamadas a `radioVisualizer.classList`, el `<div id="radioVisualizer">` en HTML y los estilos `.audio-waves` + `@keyframes soundWave` en CSS
