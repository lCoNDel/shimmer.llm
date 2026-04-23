# Changelog — 2026-04-21

## Radar de lluvia — corrección de bugs y mejoras

### Zoom bloqueado mientras el radar está activo
- Al activar el radar, `minZoom` y `maxZoom` se fijan ambos a `RADAR_MAX_ZOOM` (7), impidiendo cualquier cambio de zoom
- Al desactivar, se restauran los valores originales (`minZoom: 4`, `maxZoom: 18`)
- Evita que alejar o acercar el zoom haga desaparecer los tiles del radar
- `map.on('zoomend')` actualizado para restaurar también `minZoom` al desactivar

### Corrección de race condition en la activación
- El ajuste de zoom (`setMinZoom`, `setMaxZoom`, `setZoom`) se realiza ahora **antes** de llamar a `radarShowFrame`
- Antes, el tile layer se creaba con `maxZoom: 7` mientras el mapa podía estar en zoom > 7, lo que hacía que Leaflet ocultara la capa inmediatamente
- El zoom se corrige de forma síncrona (sin animación) para garantizar que los tiles se cargan en el zoom correcto desde el primer frame

### Corrección de intervalos apilados (reloj rápido)
- `radarStartAnim` ahora llama a `clearInterval` antes de crear nuevos intervalos
- Antes, activar/desactivar rápidamente apilaba múltiples `setInterval`, haciendo avanzar la animación varios frames por segundo

### Guard de estado tras await
- Añadido `if (!isRadarActive) return` inmediatamente después del `await getRainViewerFrames()`
- Evita que la animación arranque si el radar fue desactivado durante la petición a la API

### Refresco automático de frames (cada 5 minutos)
- Nueva función `radarRefreshFrames()`: re-fetcha la lista de frames de RainViewer sin interrumpir la animación
- `radarStartAnim` inicia un `setInterval` de 5 minutos (`RADAR_REFRESH_MS`) que llama a `radarRefreshFrames`
- `radarStopAnim` limpia también este intervalo de refresco
- Previene que frames con URLs de tiles caducadas o temporalmente no disponibles provoquen una capa en blanco

### Velocidad de animación
- Intervalo de animación aumentado de 1000ms a **1500ms** por frame para una transición más pausada

---

## Contexto técnico para agentes

> Stack: HTML + CSS + JS vanilla, Leaflet 1.9.4, OpenSeaMap, RainViewer API.
> Archivo afectado: `app.js` (sección `// 9.5. radar de lluvia`, líneas ~1302–1490).

### Variables de estado modificadas
- Añadida `radarRefreshInterval` (handle del `setInterval` de refresco de frames)
- Añadida `RADAR_REFRESH_MS = 5 * 60 * 1000` (constante de intervalo de refresco)

### Orden de operaciones en activación
```
1. await getRainViewerFrames()
2. if (!isRadarActive) return   ← guard nuevo
3. map.setMinZoom(RADAR_MAX_ZOOM)  ← nuevo, antes no existía
4. map.setMaxZoom(RADAR_MAX_ZOOM)
5. if (needsZoomOut) map.setZoom(RADAR_MAX_ZOOM)  ← síncrono, antes era animate:true
6. radarShowFrame(radarAnimIndex)
7. radarStartAnim()
```

### Zoom lock
- Activación: `map.setMinZoom(RADAR_MAX_ZOOM)` + `map.setMaxZoom(RADAR_MAX_ZOOM)` → zoom fijo en 7
- Desactivación (click handler): `map.setMinZoom(4)` + `map.setMaxZoom(18)`
- Desactivación (zoomend listener): `if (!isRadarActive) { map.setMinZoom(4); map.setMaxZoom(18); }`

### radarStartAnim — anti-stacking
```javascript
function radarStartAnim() {
    clearInterval(radarAnimInterval);      // guard anti-apilado
    clearInterval(radarRefreshInterval);   // guard anti-apilado
    radarAnimInterval = setInterval(..., 1500);
    radarRefreshInterval = setInterval(radarRefreshFrames, RADAR_REFRESH_MS);
}
```

### radarRefreshFrames
```javascript
async function radarRefreshFrames() {
    if (!isRadarActive) return;
    const frames = await getRainViewerFrames();
    if (!frames || !isRadarActive) return;
    radarFrames = frames;
    radarAnimIndex = Math.min(radarAnimIndex, radarFrames.length - 1);
}
```
