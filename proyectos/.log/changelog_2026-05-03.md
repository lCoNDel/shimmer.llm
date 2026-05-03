# Changelog — 2026-05-03

## tsamaps — Responsive tablet/móvil y limpieza de código

### Responsive: soporte completo para tablet y móvil en todas las orientaciones

Se añadieron cuatro nuevos breakpoints en `responsive.css` para cubrir escenarios que antes no tenían reglas propias:

| Breakpoint | Condición CSS | Dispositivo |
|---|---|---|
| Tablet portrait | `769px–1024px + orientation: portrait` | Tab S7 FE vertical |
| Tablet landscape | `769px–1366px + orientation: landscape` | Tab S7 FE horizontal |
| Móvil landscape | `orientation: landscape + max-height: 500px` | iPhone horizontal |
| (existente) | `≤768px` | Móvil portrait |

**Tablet portrait** — el panel de condiciones marítimas funciona ahora como drawer desde abajo (igual que en móvil), el botón GPS flotante es visible, y el weather panel empieza cerrado. En JS se añadió la variable `isTabletPortrait` para controlar esto en la inicialización.

**Tablet landscape** — el weather panel tiene `max-height: calc(100dvh - 80px)` para que las 6 cards quepan sin desbordarse. Los botones SOS y controles inferiores suben para no quedar fuera del viewport corto. El radar HUD baja para no solapar con el header.

**Móvil landscape** — el botón GPS aparece junto a radio y chat (left: 12/62/112px). El panel de condiciones mantiene el comportamiento de PC (panel fijo abierto). Usa `max-height: 500px` en lugar de ancho para distinguirlo del breakpoint tablet.

### Fix: botones flotantes no se encienden en táctil

**Causa raíz**: Samsung Tab S7 FE reporta `(hover: hover)` igual que un PC. Los estilos `:hover` de los botones GPS, radio y chat quedaban pegados tras el tap.

**Solución**: todos los `:hover` de botones flotantes ahora usan `@media (hover: hover) and (pointer: fine)`. `pointer: fine` identifica ratón/trackpad y excluye cualquier pantalla táctil independientemente de lo que reporte `hover`.

Afecta a: `.floating-gps-btn`, `.floating-radio-btn`, `.floating-chat-btn` en `index.css`.

### Fix: invalidateSize al cambiar orientación

Leaflet no recalculaba los tiles al girar la tablet, dejando zonas grises en el mapa. Se añadió:

```js
screen.orientation?.addEventListener('change', () => {
    setTimeout(() => map.invalidateSize(), 300);
});
```

El delay de 300ms da tiempo al navegador a completar el redibujado del viewport.

### Fix: control de zoom de Leaflet eliminado

`L.control.zoom({ position: 'bottomright' }).addTo(map)` estaba reañadiendo los botones +/- después de que `zoomControl: false` los desactivaba en la inicialización. Se eliminó la llamada por completo.

### Eliminación del sistema de tooltips

Los tooltips (`[data-tooltip]::before/::after`) se eliminaron completamente de `index.css` y `app.js`. Causaban que las etiquetas se quedaran permanentemente visibles en tablets táctiles. Sin reemplazo — no son necesarios.

Eliminado también: `showToolLabel()`, sus dos llamadas, y la variable `--z-tooltip`.

### Limpieza de código

**index.css:**
- `@keyframes spin` duplicado eliminado (quedó solo el primero)
- `--border-color` (variable no declarada) → `var(--brand-accent)` en `.waypoint-form input`
- Llave de cierre huérfana eliminada (línea tras `.hidden`)
- Estilos `leaflet-control-zoom` eliminados (el control ya no se crea)
- Reglas `:focus` redundantes en botones flotantes eliminadas

**responsive.css:**
- `#radioMobileBtn` duplicado eliminado
- `.floating-alarm-container { display: flex }` redundante en tablet landscape eliminado (ya está en `index.css`)

**app.js:**
- `window.lastRequestedLat/Lng` → variables de módulo `lastRequestedLat/Lng` (declaradas junto a `lastGpsLat/Lng`)
- `showToolLabel()` no-op y sus llamadas eliminadas

### Refactorizaciones estructurales (app.js)

**`closePanel()` genérica:**
```js
function closePanel(panelEl, btnEl = null) {
    panelEl.classList.add('closed');
    if (btnEl) { btnEl.classList.remove('active'); btnEl.blur(); }
}
```
Los 5 wrappers (`closeWeatherPanel`, `closeRadioPanel`, `closeSearchPanel`, `closeSunMoonPanel`, `closeChatPanel`) se mantienen y usan `closePanel` internamente.

**`debounce()` helper:**
```js
function debounce(fn, ms) {
    let timer = null;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}
```
Sustituye los patrones manuales `globalSearchTimeout` y `radioSearchTimeout`. Se usan como `debouncedFetchSuggestions` y `debouncedSearchRadio`.

**`clearDealerMarkers()`:** elimina markers del mapa y vacía el array antes de nuevas búsquedas.

**Guard `gpsMarineRefreshId`:** `if (!gpsMarineRefreshId) gpsMarineRefreshId = setInterval(...)` evita doble arranque del interval GPS.

---

## Contexto técnico para agentes

**Archivos modificados:**
- `.webapps/dev/tsamaps/app.js`
- `.webapps/dev/tsamaps/index.css`
- `.webapps/dev/tsamaps/responsive.css`
- `.webapps/prod/tsamaps/app.js` ← sincronizado desde dev al final de sesión
- `.webapps/prod/tsamaps/index.css` ← sincronizado
- `.webapps/prod/tsamaps/responsive.css` ← sincronizado

**Breakpoints activos en responsive.css (orden de aplicación):**
1. Base (`index.css`) — desktop/PC
2. `≤1024px` — tablet general (anchos de panel)
3. `769px–1024px` — tablet cualquier orientación (SOS position)
4. `769px–1024px + portrait` — tablet portrait (drawer weather, botón GPS)
5. `≤768px` — móvil portrait (layout completo mobile)
6. `769px–1366px + landscape` — tablet landscape (max-height weather, botones)
7. `orientation: landscape + max-height: 500px` — móvil landscape (botones GPS/radio/chat)
8. `≤430px` — móvil pequeño

**Variable crítica en JS — detección tablet portrait:**
```js
const isTabletPortrait = window.innerWidth > 768 && window.innerWidth <= 1024
    && window.matchMedia('(orientation: portrait)').matches;
if (window.innerWidth > 768 && !isTabletPortrait) weatherPanel.classList.remove('closed');
```
Si se elimina esta condición, el weather panel se abre automáticamente en tablet portrait en lugar de esperar al botón GPS.

**Por qué `pointer: fine` en lugar de `hover: none`:**
La Tab S7 FE reporta `(hover: hover)` incluso siendo táctil. `(pointer: fine)` es el discriminador correcto: solo es `fine` con ratón o trackpad, nunca con dedo. Cambiar esto de vuelta a `(hover: hover)` solo rompería el fix en tablets Samsung y similares.

**`screen.orientation` con delay 300ms:**
El `setTimeout(..., 300)` en el listener de orientación es intencional. Sin él, `invalidateSize()` se ejecuta antes de que el navegador haya terminado de redimensionar el viewport y los tiles siguen en gris.
