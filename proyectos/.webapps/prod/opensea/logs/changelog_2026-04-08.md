# Changelog — 2026-04-08

## Panel de distribuidores — efecto push
- La columna lateral de distribuidores ya no se superpone sobre el mapa: empuja el contenido hacia la derecha
- Animación de apertura mediante transición CSS `width` de `0` a `400px` con `overflow: hidden` en `.search-panel`
- Añadido wrapper `.search-panel-inner` (`min-width: 400px`) para evitar que el contenido se recoloque durante la animación
- Tablet (≤1024px): `search-panel-inner` sobreescrito a `min-width: 340px` en `responsive.css`
- Mobile (≤768px): `search-panel` sigue siendo drawer desde abajo; `.search-panel-inner` sin `min-width` para adaptar al ancho completo

## Mareas — nivel del mar
- Nueva tarjeta "Nivel Mar" en el panel de condiciones marítimas con datos de `sea_level_height_msl` de la Open-Meteo Marine API
- Grid de meteorología marina reestructurado de 5 tarjetas (una con `grid-column: span 2`) a 6 tarjetas en 2×3
- Tarjeta "Temperatura en Superficie" renombrada a "Temp. Mar" para ajustarse al nuevo ancho
- Valor extraído del índice de la hora actual (`new Date().getHours()`) del array `hourly.sea_level_height_msl`
- Disclaimer de precisión dentro de la propia tarjeta (clase `.card-disclaimer`, texto en cursiva): "Dato orientativo. No apto para navegación."
- Actualización en-place incluida: `data-key="sea-level"` incorporado al objeto `updates` de `renderWeatherGrid`

## Calculadora Sol / Luna
- Nueva funcionalidad de cálculo local de eventos astronómicos usando la librería SunCalc (CDN jsDelivr)
- Botón `#sunMoonBtn` añadido al header, a la izquierda del buscador de direcciones
- Panel flotante `#sunMoonPanel` (esquina superior izquierda del mapa): muestra amanecer, atardecer, fase lunar, salida y puesta de luna, coordenadas usadas
- Función `computeSunMoon(lat, lng)`: usa `SunCalc.getTimes()`, `SunCalc.getMoonTimes()` y `SunCalc.getMoonIllumination()`
- Prioridad de coordenadas: GPS activo → último punto clicado en el mapa → centro del mapa
- El panel se actualiza automáticamente al hacer clic en el mapa si está abierto (sin necesidad de cerrarlo y volver a abrirlo)
- Mobile: panel centrado horizontalmente, ancho `calc(100vw - 2rem)`, posicionado bajo el header

## Radio — panel independiente
- El módulo de radio deja de estar dentro del weather panel: nuevo botón flotante `#radioBtn` (icono antena, esquina superior izquierda del mapa)
- Nuevo panel `#radioPanel` como hermano directo de `<main>`: posición absoluta en desktop (`top: 68px; left: 16px`), drawer desde abajo en mobile
- Eliminada toda la lógica de extracción dinámica del DOM al cargar en mobile (había un bloque que movía `.radio-section` al `app-container`)
- Swipe-to-close aplicado a `radioPanel` con el mismo patrón de los otros drawers
- Mobile: `#radioBtn` es el punto de entrada único; se oculta `#radioMobileBtn` (renombrado a `#radioBtn` en toda la base de código)

## Radio — feedback de reproducción
- El botón `#radioBtn` pulsa entre blanco y azul (`#0066cc`) mientras hay reproducción activa
- Animación CSS `radioIconPulse`: alterna `background-color` y `color` cada 1.5s (`ease-in-out, infinite, alternate`)
- Clase `.playing` añadida en el evento `play` del `<audio>` y eliminada en `pause`/`ended`

## Radio — volumen por defecto
- Volumen inicial del reproductor fijado a `0.5` (`radioPlayer.volume = 0.5`)
- Slider de volumen inicializado con `value="0.5"`; etiqueta de porcentaje muestra `50%` al cargar

## Mapa — prevención de duplicación mundial
- Añadido `maxBounds: [[-90, -180], [90, 180]]` y `maxBoundsViscosity: 1.0` al inicializar el mapa Leaflet
- Todas las capas de tiles con `noWrap: true` (CartoDB base, CartoDB labels, OpenSeaMap)
- `minZoom: 4` para evitar que al alejarse se vea el mundo repetido en gris
- El zoom mínimo sustituye al gris vacío sin impedir el uso normal de la carta náutica

## Manual de Uso — rediseño completo
- Reescrito íntegramente: organizado por categorías con encabezado de sección, sin referencias a ubicaciones físicas de los controles
- Cada acción precedida por su icono SVG inline para identificación visual inmediata
- Categorías: Navegación básica, Meteorología marina, Herramientas de navegación, Tráfico y radar, Radio, Información y ajustes
- Eliminadas las descripciones de posición ("botón en la esquina superior izquierda…") — el icono actúa como referencia

## Servidor de desarrollo — corrección de directorio
- `start.ps1` (dev y prod): añadido `Set-Location $PSScriptRoot\..` antes de lanzar `npx http-server`
- Corregía un bug por el que el servidor se iniciaba desde el directorio `runtime/` y servía los archivos incorrectos

## Protección de producción — CLAUDE.md
- Centralizadas las reglas de autorización en `proyectos/CLAUDE.md` (sección "Reglas por zona")
- Eliminados los archivos `CLAUDE.md` dispersos en `.webapps/`, `.webapps/dev/` y `.webapps/prod/`
- Regla activa: cualquier cambio en `prod/` requiere descripción explícita del cambio + confirmación del usuario antes de proceder

---

## Contexto técnico para agentes

> Stack: HTML + CSS + JS vanilla, Leaflet 1.9.4, OpenSeaMap, CartoDB, Open-Meteo Marine API, SunCalc, Radio Browser API.
> Archivos principales: `app.js`, `index.html`, `index.css`, `responsive.css` en `.webapps/dev/opensea/` y `.webapps/prod/opensea/`.
> Todo el JS está dentro de un único `document.addEventListener('DOMContentLoaded', async () => { ... })`.

### Mareas — integración con renderWeatherGrid
**Archivos:** `app.js` (`fetchMarineWeatherAnalysis`, `renderWeatherGrid`), `index.css` (`.card-disclaimer`)

- URL de la API: `&hourly=sea_surface_temperature,sea_level_height_msl`
- Índice de hora actual: `const currentHourIndex = new Date().getHours()`
- Valor extraído: `data.hourly.sea_level_height_msl[currentHourIndex]`, pasado a `renderWeatherGrid` como `seaLevel`
- Grid: 6 tarjetas con `grid-template-columns: repeat(2, 1fr)` y sin `grid-column: span 2` en ninguna
- `data-key` de la nueva tarjeta: `sea-level`; incluido en el objeto `updates` del path de actualización in-place
- `.card-disclaimer`: `font-style: italic; font-size: 0.72rem; color: var(--text-muted); margin-top: 4px`

### Sol / Luna — cálculo local con SunCalc
**Archivos:** `app.js` (`computeSunMoon`, listener `#sunMoonBtn`), `index.html` (`#sunMoonPanel`, script SunCalc), `index.css` (`.sun-moon-panel`), `responsive.css` (mobile overrides)

- CDN: `https://cdn.jsdelivr.net/npm/suncalc/suncalc.js` cargado antes de `app.js`
- `computeSunMoon(lat, lng)`: invoca `SunCalc.getTimes(new Date(), lat, lng)`, `SunCalc.getMoonTimes(new Date(), lat, lng)`, `SunCalc.getMoonIllumination(new Date())`
- Fase lunar calculada desde `illumination.phase` (0–1): mapeado a 8 nombres en español
- Panel abre primero (`classList.remove('closed')`), luego `computeSunMoon` en try/catch — evita que un error de SunCalc deje el panel sin abrir
- Actualización on-click: `map.on('click', ...)` invoca `computeSunMoon` si `!sunMoonPanel.classList.contains('closed')`
- Coordenadas: `lastGpsLat/lastGpsLng` (si GPS activo) → `window.lastRequestedLat/Lng` (último clic) → `map.getCenter()`
- `.sun-moon-panel`: `position: absolute; top: 68px; left: 16px; z-index: 1050`; transición `opacity + translateY(-12px)` al cerrar

### Radio — panel independiente
**Archivos:** `app.js` (listeners `#radioBtn`, `#closeRadioBtn`), `index.html` (`#radioBtn` flotante, `#radioPanel`), `index.css` (`.floating-radio-btn`, `.radio-panel`, `@keyframes radioIconPulse`), `responsive.css` (mobile drawer)

- `#radioBtn`: `position: absolute; top: 12px; left: 12px; z-index: 1050` — separado del header
- `.playing` en `#radioBtn`: activa `radioIconPulse` — alterna entre `background: white / color: #0066cc` y `background: #0066cc / color: white` cada 1.5s
- Listeners de audio: `radioPlayer.addEventListener('play', () => radioBtn.classList.add('playing'))` y `pause`/`ended` para removerla
- `radioPlayer.volume = 0.5` establecido en la inicialización
- Mobile: `#radioPanel` sigue el mismo patrón de drawer que `weatherPanel` y `searchPanel` (`position: fixed; bottom: 0; max-height: 75vh`)
- `addSwipeToClose(radioPanel)` aplicado en el bloque de inicialización mobile

### Panel de distribuidores — efecto push
**Archivos:** `index.css` (`.search-panel`, `.search-panel-inner`), `responsive.css` (overrides tablet y mobile)

- `.search-panel`: `flex-shrink: 0; width: 0; overflow: hidden; transition: width 0.35s cubic-bezier(0.16,1,0.3,1)`
- Al abrir: `searchPanel.style.width = '400px'`; al cerrar: `searchPanel.style.width = '0'`
- `.search-panel-inner`: `min-width: 400px` previene que el contenido se comprima durante la animación de width
- El contenedor padre (`.app-body` o equivalente) es `display: flex` — el mapa absorbe/cede espacio automáticamente

### Mapa — control de duplicación
**Archivos:** `app.js` (inicialización de `L.map` y capas de tiles)

- `L.map('map', { maxBounds: [[-90,-180],[90,180]], maxBoundsViscosity: 1.0, minZoom: 4 })`
- Capas: `L.tileLayer(url, { noWrap: true, ... })`
- `minZoom: 4` es el límite práctico para España/Europa sin gris visible en pantallas normales
