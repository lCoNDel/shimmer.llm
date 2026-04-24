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

---

## tsamaps — Favicon, logo y permisos Claude Code (tercera sesión)

### Favicon (index.html)
- Añadido `<link rel="icon">` en el `<head>` apuntando a la imagen del logo de Touron (Google CDN)
- Elimina el 404 en `/favicon.ico` que registraba ngrok en cada visita
- La imagen cuadrada no se puede redondear desde CSS en el favicon (limitación del navegador) — se dejó así

### Logo en el header — redondeado (index.css)
- `.brand-logo-img` actualizado: `width: 28px`, `object-fit: cover`, `border-radius: 50%`, `display: block`
- `display: block` elimina el espacio de baseline implícito de los elementos `<img>` inline
- El logo queda recortado en círculo en la web

### Sincronización dev → prod
- Sincronizados a prod: `index.html`, `index.css`, `responsive.css`, `Runtime.md`, `runtime/start.sh`, `runtime/stop.sh`
- `runtime/start.sh` y `runtime/stop.sh` de prod estaban desactualizados (versión antigua con `http-server`); ahora usan Docker compose

### Permisos Claude Code (.claude/settings.json)
- Creado `.claude/settings.json` con allowlist de permisos para la secuencia completa del servicio web:
  - `docker compose -f * up -d *`, `docker compose -f * stop *`, `docker compose -f * down*`
  - `docker stop *`, `docker start *`, `docker ps *`, `docker logs *`
  - `bash ./runtime/start.sh`, `bash ./runtime/stop.sh`
  - `cp *`
  - `PowerShell(*)` — autoriza cualquier comando PowerShell en el proyecto (necesario para `tunnel.ps1`)
- Eliminado `settings.local.json` (reemplazado por `settings.json`)

### System prompt asistente — sección TSA Maps
- Propuesta de ampliación del system prompt del modelo `asistente-touron` en Open WebUI
- Nueva sección `## TSA Maps` con descripción de todas las funcionalidades de la plataforma
- Pendiente de aplicar manualmente en Open WebUI por el usuario

---

## Contexto técnico para agentes (tercera sesión)

> Archivos modificados: `index.css`, `index.html` (dev y prod), `Runtime.md`, `runtime/start.sh`, `runtime/stop.sh` (prod), `.claude/settings.json` (nuevo)

### .brand-logo-img — estado actual
```css
.brand-logo-img {
    height: 28px;
    width: 28px;
    object-fit: cover;
    border-radius: 50%;
    display: block;
}
```

### Favicon — estado actual (index.html head)
```html
<link rel="icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwP6ECO812KN688mb1LhBvRawScR7tbavVCg&s" type="image/png">
```

### Runtime prod — ahora usa Docker compose
`start.sh` lanza `docker compose -f ../../../../.docker/compose/proxy.yml up -d tsamaps_server`
`stop.sh` para el contenedor y cierra ngrok vía `powershell.exe`

---

## tsamaps — Separación de entornos dev/prod en proxy Docker (cuarta sesión)

### Contexto
Hasta ahora `proxy.yml` tenía un único servicio `tsamaps_server` apuntando a `dev/tsamaps`. Se separó en dos servicios independientes para poder levantar dev o prod a voluntad sin rutas relativas compartidas.

### proxy.yml — dos servicios independientes
- `tsamaps_server` renombrado a `tsamaps_server_dev` (monta `.webapps/dev/tsamaps`)
- Añadido `tsamaps_server_prod` (monta `.webapps/prod/tsamaps`)
- Ambos usan puerto 5050 — nunca corren simultáneamente
- Archivo: `.docker/compose/proxy.yml`

### server.py creado en prod
- `server.py` no existía en `prod/tsamaps` — creado con el mismo contenido que `dev/tsamaps/server.py`
- Archivo: `.webapps/prod/tsamaps/server.py`

### Scripts de runtime actualizados
- `dev/tsamaps/runtime/start.sh` y `stop.sh` actualizados para referenciar `tsamaps_server_dev`
- Creados `prod/tsamaps/runtime/start.sh`, `stop.sh` y `tunnel.ps1` referenciando `tsamaps_server_prod`

### Runtime.md actualizados
- `dev/tsamaps/Runtime.md` y `prod/tsamaps/Runtime.md` actualizados: describen su propio entorno, el servicio Docker correcto y el arranque conjunto (servidor + túnel ngrok siempre juntos)

### Permisos Claude Code
- Añadidos a `.claude/settings.json`: `Bash(bash *runtime/start.sh*)` y `Bash(bash *runtime/stop.sh*)` para cubrir rutas absolutas desde cualquier directorio

### 00_memoria.html — ediciones de contenido
- Sección "Compromisos y Ruegos": punto de Concienciación/Formación movido al primer lugar
- Texto del punto reescrito: título cambiado a "Concienciación — Cómo funciona una IA y Prompting", contenido ampliado con explicación de que la IA no almacena datos sino que aprende patrones estadísticos; "almacena datos" y "aprende patrones" en negrita
- Orden de secciones invertido: "Compromisos y Ruegos" ahora precede a "Implicaciones Técnicas y Responsabilidades"
- Archivo: `C:\Users\luisc\OneDrive - TOURON, S.A\IT - Documentos\PROYECTOS\SISTEMAS\Plataforma LLM & RAG\00_memoria.html`

---

## Contexto técnico para agentes (cuarta sesión)

> Archivos modificados: `.docker/compose/proxy.yml`, `.webapps/dev/tsamaps/runtime/start.sh`, `.webapps/dev/tsamaps/runtime/stop.sh`, `.webapps/dev/tsamaps/Runtime.md`, `.webapps/prod/tsamaps/server.py` (nuevo), `.webapps/prod/tsamaps/runtime/start.sh` (nuevo), `.webapps/prod/tsamaps/runtime/stop.sh` (nuevo), `.webapps/prod/tsamaps/runtime/tunnel.ps1` (nuevo), `.webapps/prod/tsamaps/Runtime.md`, `.claude/settings.json`

### proxy.yml — estructura actual
```yaml
services:
  tsamaps_server_dev:   # monta .webapps/dev/tsamaps
  tsamaps_server_prod:  # monta .webapps/prod/tsamaps
# ambos en puerto 5050 — nunca simultáneos
```

### Arranque del servicio web (cualquier entorno)
El agente ejecuta siempre dos pasos:
1. `bash ./runtime/start.sh` en background → levanta el contenedor Docker
2. `powershell -File ./runtime/tunnel.ps1` → abre ngrok en ventana visible

---

## tsamaps + bots — Búsqueda web DuckDuckGo, spotlight bienvenida, iconos manual, ajustes chat (quinta sesión)

### Búsqueda web con /web — bot Telegram y tsamaps dev
- Integrada la librería `duckduckgo-search` (sin API key, gratuita)
- Comando `/web <consulta>` disponible en Telegram y en el chat web de tsamaps
- Al detectar `/web`, se buscan los 5 primeros resultados y se inyectan como mensaje `system` antes de llamar a Open WebUI
- El historial de conversación se mantiene para iterar sobre las respuestas
- `requirements.txt` actualizado con `duckduckgo-search`
- `proxy.yml` actualizado: `duckduckgo-search` añadido al `pip install` del comando de arranque de `tsamaps_server_dev`
- Archivos: `.docker/.bots/telegram/asistente_nautico.py`, `.docker/.bots/telegram/requirements.txt`, `.docker/compose/proxy.yml`, `.webapps/dev/tsamaps/server.py`

### Spotlight de bienvenida (tsamaps dev)
- Al cerrar el banner de permisos de primera visita, aparece un overlay oscuro que destaca el botón `?` del Manual
- Texto: "¿Primera vez? / Pulsa este botón para abrir el Manual de Uso"
- Se cierra con botón "Entendido", pulsando el `?`, o haciendo clic en el overlay
- Controlado por `localStorage.getItem('guideTipSeen')` — solo aparece una vez
- Archivos: `.webapps/dev/tsamaps/index.html`, `.webapps/dev/tsamaps/index.css`, `.webapps/dev/tsamaps/app.js`

### Iconos en el Manual de Uso
- Cada entrada del manual ahora muestra el SVG del botón correspondiente en el color de su sección
- Archivos: `.webapps/dev/tsamaps/index.html`

### Chat panel — ajustes de tamaño y alineación
- Ancho: 410px, alto de mensajes: 438px
- `.close-btn` dentro de `.panel-header` sobreescrito con `position: static; font-size: 1.5rem` para corregir desalineación de la X
- Segunda definición de `.close-btn` (modales) añadidos `display: flex; align-items: center`
- Mensaje de bienvenida automático ("Hola!") eliminado — sustituido por burbuja prefijada visible solo para el usuario que describe el agente y el comando `/web`
- Archivos: `.webapps/dev/tsamaps/index.css`, `.webapps/dev/tsamaps/app.js`

---

## Contexto técnico para agentes (quinta sesión)

> Archivos modificados: `.docker/.bots/telegram/asistente_nautico.py`, `.docker/.bots/telegram/requirements.txt`, `.docker/compose/proxy.yml`, `.webapps/dev/tsamaps/server.py`, `.webapps/dev/tsamaps/app.js`, `.webapps/dev/tsamaps/index.css`, `.webapps/dev/tsamaps/index.html`

### Flujo /web en server.py (dev)
```python
# Detecta el prefijo en el último mensaje del usuario
# Llama a search_web(query, max_results=5)
# Inyecta resultados como {"role": "system", "content": search_results}
# al inicio del array de mensajes antes de llamar a Open WebUI
```

### Flujo /web en asistente_nautico.py
- Handler dedicado `@bot.message_handler(commands=['web'])` — necesario porque Telegram trata `/web` como comando, no como texto libre
- Los resultados de búsqueda NO se guardan en el historial — solo se inyectan en esa llamada

### guide-spotlight — estado actual
- HTML: `<div id="guideTip" class="guide-spotlight hidden">` — fuera del header, justo antes de `<main>`
- JS: `showGuideTip()` calcula posición de `openGuideBtn` con `getBoundingClientRect()` en tiempo de ejecución
- Se activa desde `requestPermissions()` y desde el listener de `permissionsDismissBtn`
- Clave localStorage: `guideTipSeen`

---

## tsamaps + bots — Fix búsqueda web /web y migración a ddgs (sexta sesión)

### Problema raíz: librería duckduckgo-search deprecada
- `duckduckgo-search` v8 devolvía resultados vacíos para consultas en español
- La librería fue renombrada oficialmente a `ddgs` — el paquete antiguo lanza `RuntimeWarning` al importar
- Migración completa a `ddgs` en todos los archivos

### Cambios en asistente_nautico.py
- Import cambiado: `from duckduckgo_search import DDGS` → `from ddgs import DDGS`
- Inyección de resultados corregida: de `{"role": "system", "content": search_results}` a mensaje de usuario enriquecido:
  ```
  Usa los siguientes resultados de búsqueda web para responder:\n\n{search_results}\n\nPregunta: {query}
  ```
  Motivo: Open WebUI ignora mensajes `system` inyectados externamente cuando el modelo tiene su propio system prompt configurado
- Mismo patrón aplicado en `handle_web_command()` y en el fallback de `handle_message()`

### Cambios en server.py (dev)
- Import cambiado: `from duckduckgo_search import DDGS` → `from ddgs import DDGS`
- Misma corrección de inyección como mensaje de usuario enriquecido

### Cambios en requirements.txt
- `duckduckgo-search` → `ddgs`

### Cambios en proxy.yml
- Comando de arranque de `tsamaps_server_dev`: `duckduckgo-search` → `ddgs`

---

## Contexto técnico para agentes (sexta sesión)

> Archivos modificados: `.docker/.bots/telegram/asistente_nautico.py`, `.docker/.bots/telegram/requirements.txt`, `.docker/compose/proxy.yml`, `.webapps/dev/tsamaps/server.py`

### Flujo /web corregido — inyección como mensaje de usuario
```python
enriched_content = f"Usa los siguientes resultados de búsqueda web para responder:\n\n{search_results}\n\nPregunta: {query}"
user_history[user_id]["messages"].append({"role": "user", "content": enriched_content})
# NO se inyecta {"role": "system"} — Open WebUI lo ignora si el modelo tiene system prompt propio
```

### ddgs — uso correcto
```python
from ddgs import DDGS
with DDGS() as ddgs:
    results = list(ddgs.text(query, max_results=5))
# Devuelve lista de dicts: {"title": ..., "body": ..., "href": ...}
```

### Estado del log de búsqueda en asistente_nautico.py
- Línea de log: `logging.info(f"Búsqueda web para '{query}': {len(search_results)} chars de resultados\n{search_results}")`
- Incluye el contenido bruto de DuckDuckGo — útil para depuración, puede eliminarse en producción
