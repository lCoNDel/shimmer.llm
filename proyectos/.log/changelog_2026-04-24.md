# Changelog — 2026-04-24

## tsamaps — Manual de uso, permisos y correcciones UI

### Manual de uso (index.html)
- Título del modal cambiado a "Manual de Uso y Créditos"
- Nueva sección **Asistente Náutico IA** añadida al manual: descripción del LLM de Touron S.A., límites y responsabilidad
- Sección "Distribuidores" renombrada a **Red Náutica** (coherente con el nombre en la UI)
- GPS: descripción corregida — el botón abre el panel de condiciones marítimas, no activa el GPS directamente
- Eliminados los iconos cuadrados (36×36) de cada entrada del manual; texto más limpio
- Sección "Contexto de conversación" del asistente eliminada
- Aviso de responsabilidad simplificado: "No sustituye consultas al personal especializado de Touron y puede cometer errores"
- Créditos: Luis Conde añadido como primero ("idea, diseño conceptual y programación")
- SunCalc eliminado de créditos (fórmula propia)
- Título de página `<title>` cambiado de "Shimmer - Cartógrafo" a **TSA Maps**
- Modal "Sobre el Proyecto": título y descripción actualizados a **TSA Maps**; asistente náutico añadido a la lista de funcionalidades

### Permisos de primera visita
- Eliminada la solicitud de permiso de notificaciones del navegador en todos los puntos:
  - Banner de primera visita (botón "Conceder permisos")
  - Activación de alarma de fondeo
- El banner de permisos ahora solo aparece si falta geolocalización (no depende de notificaciones)
- Las notificaciones del navegador (alarma de fondeo) siguen funcionando si el usuario ya las tenía concedidas

---

## tsamaps — Correcciones de estado de botones y bugs funcionales

### Bug: botón GPS no se apagaba al cerrar el panel por swipe o X
- Creada función `closeWeatherPanel()` que centraliza el cierre del panel y el apagado del botón `gpsShortcutBtn`
- Los tres caminos de cierre (botón toggle, X del panel, swipe) ahora usan la misma función
- Patrón extendido a todos los paneles (ver refactor de paneles)

### Bug: botón del chat visible durante VesselFinder
- `enterTrafficMode()` ahora oculta `chatBtn`
- `exitTrafficMode()` lo restaura

---

## tsamaps — Revisión completa de código (app.js, index.html, index.css)

### Bugs funcionales corregidos

**isSosLocked faltante**
- `radioBtn` y `openSearchBtn` ahora comprueban `isSosLocked()` — radio y búsqueda quedan bloqueados durante MOB

**Fuga de setInterval en GPS**
- `clearInterval(gpsMarineRefreshId)` añadido antes de crear el nuevo interval de refresco marino, evitando acumulación si el usuario activa/desactiva el GPS rápidamente

**setTimeout acumulativo en radarShowFrame**
- Introducida variable `radarLayerPrevTimeout` con `clearTimeout` previo al nuevo `setTimeout`, evitando hasta 7-8 timeouts pendientes simultáneos

**Doble map.on('click')**
- Los dos handlers de clic en el mapa (datos marinos + regla náutica) consolidados en uno solo que despacha según `isRulerActive`

### Refactor de paneles — funciones de cierre centralizadas

Creadas cuatro funciones nuevas siguiendo el patrón de `closeWeatherPanel()`:

| Función | Panel | Botón que apaga |
|---|---|---|
| `closeRadioPanel()` | radioPanel | radioBtn |
| `closeSearchPanel()` | searchPanel | — |
| `closeSunMoonPanel()` | sunMoonPanel | sunMoonBtn |
| `closeWeatherPanel()` | weatherPanel | gpsShortcutBtn |
| `closeChatPanel()` | chatPanel | chatBtn (ya existía) |

Sustituidas todas las ocurrencias inline (~15) por llamadas a estas funciones. Incluye:
- `closeMobileSearch()`: ahora también apaga el botón de radio
- `enterTrafficMode()`: usa `closeSearchPanel()`
- `openChatPanel()`: usa las cuatro funciones de cierre
- Activación de tráfico, radar, regla y viento: usan `closeRadioPanel()`

**Swipe añadido a paneles que lo tenían pendiente**
- `sunMoonPanel` y `chatPanel` ahora tienen `addSwipeToClose()`
- El handler de swipe despacha a la función de cierre correcta según el panel (para que el botón se apague correctamente)

### Limpieza HTML
- Comentario trilingüe redundante eliminado
- 8 IDs huérfanos eliminados (no referenciados en JS): `floatingTrafficContainer`, `floatingWeatherContainer`, `floatingWindContainer`, `floatingRulerContainer`, `floatingSunMoonContainer`, `floatingMobileSearchContainer`, `floatingAlarmContainer`, `sunMoonContent`

### Limpieza CSS (index.css)
Clases sin uso eliminadas:
- `.app-title`
- `.custom-map-controls`, `.geo-btn`, `.geo-btn:hover`, `.geo-btn:active`, `.geo-btn.loading`, `@keyframes pulse`
- `.sidebar` (dentro de media query)
- `.utilities-dropdown`, `.utilities-dropdown.closed`, `.dropdown-item`, `.dropdown-item:hover`, `.dropdown-item.active`
- `.dropdown-utilities`
- `.chat-bubble--user`, `.chat-bubble--typing`

---

## Contexto técnico para agentes

> Archivos modificados: `app.js`, `index.html`, `index.css`
> La revisión se desarrolló primero en `.webapps/dev2/tsamaps` (copia temporal) y luego se movió a `.webapps/dev/tsamaps`. `dev2` fue eliminado.

### Funciones de cierre de paneles (app.js)
Definidas justo después de `closeWeatherBtn` listener, antes del bloque de información:
```javascript
function closeWeatherPanel()  // weatherPanel + gpsShortcutBtn.active
function closeRadioPanel()    // radioPanel + radioBtn.active
function closeSearchPanel()   // searchPanel (sin botón asociado)
function closeSunMoonPanel()  // sunMoonPanel + sunMoonBtn.active + blur
// closeChatPanel() definida al final del DOMContentLoaded (junto a chatPanel)
```

### addSwipeToClose — handler unificado
El `touchend` del swipe ahora despacha:
```javascript
if (panel === weatherPanel) closeWeatherPanel();
else if (panel === sunMoonPanel) closeSunMoonPanel();
else if (panel === chatPanel) closeChatPanel();
else panel.classList.add('closed');
```

### map.on('click') — handler único
El único handler despacha primero a la lógica de regla náutica (`if (isRulerActive)`) y hace `return`. Si no está activa, entra en la lógica de condiciones marítimas. El segundo handler redundante fue eliminado.

### Radar — radarLayerPrevTimeout
```javascript
let radarLayerPrev = null;
let radarLayerPrevTimeout = null;  // ← nuevo
// en radarShowFrame():
clearTimeout(radarLayerPrevTimeout);
radarLayerPrevTimeout = setTimeout(() => { ... }, 400);
```

---

## tsamaps — Correcciones UI móvil y banner de permisos (segunda sesión)

### Panel alarma de fondeo — desbordamiento en móvil (responsive.css)
- El panel `.floating-alarm-panel` se salía por los bordes en móvil porque `position: absolute` lo posicionaba relativo al contenedor padre `map-controls-bottom-left` (anclado a la izquierda con ancho de contenido)
- Solución: en el breakpoint `≤768px` se sobreescribe con `position: fixed`, anclado al viewport con `left: 12px; right: 12px; width: auto; bottom: calc(90px + env(safe-area-inset-bottom, 0px))`
- En desktop queda sin cambios (`position: absolute; left: 0`)

### Botón `.close-btn` — desalineación X respecto al título (index.css)
- La X de cierre de paneles (chat, radio, sol/luna, etc.) no quedaba centrada verticalmente respecto al `h2` del `panel-header`
- Causa: `font-size: 1.5rem` en el carácter `×` genera espacio vertical por line-height implícito
- Solución: añadidos `line-height: 1` y `display: flex; align-items: center` a `.close-btn`
- Aplica a todos los paneles que usan esta clase

### Banner de permisos de primera visita (index.html)
- Título cambiado: "acceso a tu dispositivo" → "acceso a tu ubicación"
- Eliminado el `<li>` de Notificaciones (la solicitud de permisos de notificación fue eliminada en sesión anterior; el banner aún lo referenciaba)
- Descripción GPS actualizada: "para la alarma de fondeo y el S.O.S" → "Seguimiento en tiempo real, alarma de fondeo y alerta MOB"
- Tip corregido al singular: "permisos no expiren" → "permiso no expire"
- Botón "Continuar sin permisos" ampliado con aviso: "(Se perderá acceso a las funcionalidades principales del aplicativo)"

---

## Contexto técnico para agentes (segunda sesión)

> Archivos modificados: `responsive.css`, `index.css`, `index.html`

### floating-alarm-panel en móvil
```css
/* responsive.css — breakpoint ≤768px */
.floating-alarm-panel {
    position: fixed;
    bottom: calc(90px + env(safe-area-inset-bottom, 0px));
    left: 12px;
    right: 12px;
    width: auto;
    transform-origin: bottom left;
}
```
El contenedor padre `map-controls-bottom-left` tiene `position: absolute; left: 12px` — cualquier `right: 0` sobre el panel hijo se resuelve relativo a ese contenedor, no al viewport. `position: fixed` es la única solución que sale del flujo correctamente.

### .close-btn alineación
```css
.close-btn {
    line-height: 1;
    display: flex;
    align-items: center;
    /* resto sin cambios */
}
```
