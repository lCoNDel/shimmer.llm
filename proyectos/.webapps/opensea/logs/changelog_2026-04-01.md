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
- **Weather Panel**: convertido en drawer que sube desde abajo (`position: fixed; bottom: 0; width: 100%; max-height: 75vh`); pill handle generado con `::before`; estado `.closed` pasa de `translateX(400px)` a `translateY(100%)`
- **Search Panel**: mismo tratamiento drawer; `height: 80vh`; estado `.closed` pasa de `translateX(100%)` a `translateY(100%)`
- **Header**: buscador oculto (`.global-search-container { display: none }`), título de app ocultado, logo comprimido
- **Controles flotantes**: subidos a `bottom: 90px` para no solaparse con el botón SOS (que permanece en `bottom: 30px`)
- **Radar HUD**: `top: 65px`, ancho fluid (`calc(100% - 32px)`), controles reducidos
- **Modales y banner de permisos**: `width: 95vw`, alturas ajustadas a `90vh`
- Sin cambios en `app.js` — la lógica de toggle (clase `.closed` + `transform`) funciona igual en ambas orientaciones

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
**Archivos:** `responsive.css` (nuevo), `index.html` (un `<link>` añadido)

- `responsive.css` es una capa de overrides pura — no importa ni extiende `index.css`
- Los paneles en móvil usan `position: fixed` (en desktop usan `position: absolute` relativo al contenedor del mapa)
- El pill handle de los drawers se genera con `::before` en CSS — no requiere HTML adicional
- Para añadir más breakpoints o ajustes futuros: editar solo `responsive.css`
