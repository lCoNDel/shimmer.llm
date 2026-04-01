# Changelog — 2026-04-01

## Condiciones Marítimas — Transición sin parpadeo
- Actualización de datos en tiempo real (GPS o clic) ya no oculta el panel ni muestra el loader en cada refresco
- Los valores individuales de cada tarjeta se actualizan en-place con animación `cardValueUpdate` (fade + deslizamiento vertical 3px, 0.35s)
- Cada `card-value` tiene ahora un atributo `data-key` para identificación directa en el DOM
- El loader solo aparece en la primera carga (cuando no existe `.weather-grid`) — comportamiento conservado
- En caso de error se limpia la grid para que el siguiente intento vuelva a mostrar el loader desde cero
- Pensado para uso con GPS activo: conforme el barco se mueve, los datos del mar se actualizan suavemente sin interrumpir la visualización

## Diseño Responsive
- Nuevo archivo `responsive.css` — capa de overrides independiente; `index.css` no se modifica
- `index.html`: añadido `<link rel="stylesheet" href="responsive.css">` tras el CSS principal

### Tablet (≤1024px)
- Paneles weather y search reducidos a 300px y 340px respectivamente
- Buscador del header reducido a 160px (foco: 200px)
- Header con padding más compacto

### Móvil (≤768px)
- **Weather Panel**: convertido en drawer que sube desde abajo (`position: fixed; bottom: 0; width: 100%; max-height: 75vh`); pill handle como `<div class="drawer-handle">` real; estado `.closed` pasa de `translateX(400px)` a `translateY(100%)`
- **Search Panel**: mismo tratamiento drawer; `height: 80vh`; estado `.closed` pasa de `translateX(100%)` a `translateY(100%)`
- **Header**: buscador oculto, título de app ocultado, nombre de empresa con `white-space: nowrap`
- **Botón × en Weather Panel**: visible solo en mobile (`#closeWeatherBtn` oculto en desktop vía `responsive.css`)
- **Swipe-to-close**: arrastrar la barra superior de cada drawer hacia abajo lo cierra; detecta velocidad (flick) y distancia (>80px); sin conflicto con el scroll del contenido
- **Buscador de direcciones en mobile**: botón lupa flotante junto a la regla náutica; al pulsarlo el buscador del header se reposiciona como overlay sobre el mapa; se cierra al seleccionar resultado, al buscar o al tocar fuera
- **Botón SOS**: reposicionado a `bottom: 50px; right: 12px` (esquina inferior derecha, alineado con herramientas)
- **Controles flotantes**: alineados a `bottom: 50px; left: 12px`; separados de los créditos del mapa
- **Zoom de Leaflet**: oculto en mobile (el pellizco con dos dedos lo sustituye)
- **Alarma de fondeo**: oculta en mobile (no aplica cuando el móvil viaja con el usuario)
- **Radar HUD**: `top: 65px`, ancho fluid (`calc(100% - 32px)`), controles reducidos
- **Modales y banner de permisos**: `width: 95vw`, alturas ajustadas a `90vh`

## Correcciones
- `stop.ps1`: corregido bug con la variable reservada `$pid` de PowerShell — renombrada a `$procId` en ambos proyectos (`opensea` y `opensea_dev`)

---

## Mejoras UX Mobile (segunda tanda)

### Botones flotantes — separación de créditos
- `bottom` subido de `16px` a `30px` en `#floatingSosContainer` y `.map-controls-bottom-left`
- Evita solapamiento visual con los créditos del mapa (Leaflet, OpenSeaMap)

### Herramientas exclusivas — sistema completo
- La búsqueda mobile (`#mobileSearchBtn`) queda integrada en el patrón de exclusividad existente
- Abrir la lupa cierra cualquier herramienta activa (tráfico, radar, viento, regla) con toast informativo
- Activar cualquier herramienta cierra la lupa si estaba abierta (`closeMobileSearch()`)
- Panel de radio también se cierra al activar herramientas o buscador

### Radio como panel independiente en mobile
- Nuevo botón `#radioMobileBtn` (icono altavoz) en el header, visible solo en mobile
- Al cargar en mobile, el nodo `.radio-section` se mueve del weather panel al `.app-container` para evitar clipping por `overflow`; recibe `id="radioFloatingPanel"`
- Panel drawer desde abajo idéntico al weather/search panel: `position: fixed; bottom: 0; max-height: 75vh; border-radius: 16px 16px 0 0`
- Swipe-to-close: `addSwipeToClose(radioFloatingPanel)` con la misma lógica de los otros drawers
- En desktop: sin cambios (radio sigue dentro del weather panel, botón oculto)

### Click en mapa bloqueado con herramienta activa
- El guard del handler `map.on('click')` se amplía a: `isTrackingActive || isRulerActive || isRadarActive || isTrafficActive || isWindLayerActive`
- Si el usuario hace click con herramienta activa: toast "Desactiva la herramienta activa para consultar condiciones marítimas" (debounced, máximo una vez cada 3s)
- GPS tracking (`isTrackingActive`) sigue siendo silencioso (no muestra toast, ya era el comportamiento anterior)

### Tooltips de herramientas — auto-dismiss
- Nueva función `showToolLabel(btn)`: añade `.tooltip-active` al activar y la elimina a los 2.5s
- Nueva clase CSS `.tooltip-active` en `index.css` que muestra el tooltip independientemente del hover
- `@media (hover: none)` en `index.css` desactiva el tooltip por `:hover` en dispositivos táctiles — en mobile el tooltip solo se muestra los 2.5s de activación y desaparece sin quedarse pegado

### Estado de botones al desactivar
- Añadido `btn.blur()` en el path de desactivación de las 4 herramientas (tráfico, radar, regla, viento)
- Elimina el estado `:focus` que el navegador mantenía tras el tap en mobile, haciendo que el botón vuelva a su aspecto normal al desactivar

### Atajo GPS en el header
- Nuevo botón `#gpsShortcutBtn` en `nav.auth-nav` (header, esquina superior derecha), visible en desktop y mobile
- Proxifica `geoBtn.click()` — toda la lógica GPS existente se reutiliza sin duplicar
- Tres estados visuales:
  - **OFF**: botón secundario normal, etiqueta "OFF"
  - **`...`** (icono pulsando, clase `gps-searching`): mientras el GPS busca señal
  - **ON** (fondo azul + glow, clase `gps-active`): cuando el bloqueo GPS está activo, etiqueta "ON"
- `syncGpsShortcut(state)`: función que sincroniza el shortcut desde los 3 puntos del handler GPS (desactivación, inicio de búsqueda, primer bloqueo, error)

### GPS — refresco periódico de condiciones marinas
- `watchPosition` solo dispara cuando el dispositivo detecta cambio de posición — en reposo o con movimiento lento los datos no se refrescaban
- Nuevo `setInterval` (`GPS_MARINE_REFRESH_MS = 5 min`) que llama a `fetchMarineWeatherAnalysis` con la última coordenada GPS conocida (`lastGpsLat`, `lastGpsLng`)
- El intervalo se inicia al activar el GPS y se limpia al desactivarlo (ambas rutas: manual y error)

## Limpieza de código muerto
- Eliminada variable `isPast` en `radarUpdateHud()` — calculada pero nunca utilizada
- Eliminado bloque "Utilities Dropdown" (22 líneas): `#utilidadesToggleBtn` y `#utilidadesDropdown` no existían en el HTML; el bloque nunca ejecutaba

---

## Contexto técnico para agentes

> Stack: HTML + CSS + JS vanilla, Leaflet 1.9.4, OpenSeaMap, RainViewer API, Nominatim.
> Archivos principales: `app.js`, `index.html`, `index.css`, `responsive.css` en `.webapps/opensea_dev/`.
> Todo el JS está dentro de un único `document.addEventListener('DOMContentLoaded', async () => { ... })`.

### Condiciones Marítimas — Actualización en-place
**Archivos:** `app.js` (función `renderWeatherGrid()`), `index.css` (`.card-value-update`, `@keyframes cardValueUpdate`)

- `renderWeatherGrid()` comprueba si ya existe `.weather-grid` en `weatherContent`
- Si existe: itera sobre los `data-key` (`swell-height`, `swell-direction`, `swell-period`, `wind-wave`, `water-temp`), actualiza `innerHTML` y fuerza `void el.offsetWidth` para reiniciar la animación CSS
- Si no existe: construye el HTML completo desde cero (primera carga)
- En el click handler (`map.on('click', ...)`): el loader solo se activa si `!weatherContent.querySelector('.weather-grid')`
- `@keyframes cardValueUpdate`: `opacity: 0.3 → 1` + `translateY(3px → 0)`, 0.35s ease-out

### Responsive — Arquitectura de archivos
**Archivos:** `responsive.css` (nuevo), `index.html` (cambios menores), `app.js` (swipe + mobile search)

- `responsive.css` es una capa de overrides pura — no toca `index.css`
- Los paneles en móvil usan `position: fixed` (en desktop usan `position: absolute`)
- El pill handle es un `<div class="drawer-handle" aria-hidden="true">` real al inicio de cada panel — necesario para recibir eventos touch
- Elementos exclusivos de desktop ocultos con regla global fuera de `@media`: `#closeWeatherBtn`, `#floatingMobileSearchContainer`, `#radioMobileBtn`
- Elementos exclusivos de mobile dentro del bloque `@media (max-width: 768px)`: `#floatingAlarmContainer { display: none }`

### Swipe-to-close en drawers
**Archivos:** `app.js` (función `addSwipeToClose(panel)`), `responsive.css` (`.is-dragging { transition: none }`)

- Listeners en el panel completo; se activa solo si el toque empieza en los primeros 80px desde la parte superior (`SWIPE_ZONE_HEIGHT`)
- Durante el arrastre: `panel.classList.add('is-dragging')` + `panel.style.transform = translateY(deltaY)`
- Al soltar: si `deltaY ≥ 80px` o `velocidad ≥ 0.3px/ms` → `classList.add('closed')`; si no → snap-back limpiando el inline style
- `touchcancel` manejado para evitar estados inconsistentes
- Todos los listeners con `{ passive: true }`
- Guard `window.innerWidth > 768` en `touchstart` y `touchmove`
- Aplicado a: `weatherPanel`, `searchPanel`, `radioFloatingPanel`

### Buscador de direcciones en mobile
**Archivos:** `app.js` (listener `#mobileSearchBtn`), `responsive.css` (`body.mobile-search-active .global-search-container`)

- `#mobileSearchBtn`: botón flotante junto a `#floatingRulerContainer`, oculto en desktop
- Al activar: `document.body.classList.add('mobile-search-active')` reposiciona `.global-search-container` como `position: fixed; top: 56px` vía CSS
- Se cierra: al seleccionar sugerencia del dropdown, al completar búsqueda (`performGlobalSearch`), o al tocar fuera (listener en `document`)
- Toda la lógica de búsqueda (Nominatim, debounce, marcador) se reutiliza sin duplicación

### Sistema exclusivo de herramientas
**Archivo:** `app.js`

- Patrón: al activar una herramienta, llama `.click()` en las demás activas + `showToast()`
- `closeMobileSearch()` integrado en los 4 bloques de activación (tráfico, radar, regla, viento)
- Cierre del radio panel (`#radioFloatingPanel`) integrado en `closeMobileSearch()` y en los 4 bloques
- `showToolBlockedFeedback()`: toast debounced (3s) al intentar usar el mapa con herramienta activa

### Atajo GPS — sincronización de estado
**Archivos:** `app.js`, `index.html`, `index.css`

- `syncGpsShortcut(state)`: llamada desde 4 puntos del handler GPS
- Estados: `'off'` → label "OFF", sin clases; `'searching'` → clase `gps-searching`, label "...", icono pulsa (`@keyframes gpsPulse`); `'active'` → clase `gps-active`, label "ON", fondo azul
- `GPS_MARINE_REFRESH_MS = 300000` (5 min): `setInterval` activo mientras GPS está encendido; usa `lastGpsLat` / `lastGpsLng` actualizadas en cada callback de `watchPosition`

### Tooltips — comportamiento táctil
**Archivos:** `index.css`

- `@media (hover: none)`: anula `:hover::before/after` en touch — evita que el tooltip quede pegado tras el tap
- `.tooltip-active`: clase JS temporal (2.5s) que muestra el tooltip en activación; funciona en todos los dispositivos
