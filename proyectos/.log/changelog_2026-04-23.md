# Changelog — 2026-04-23

## Asistente Náutico IA — widget de chat integrado en tsamaps

### Widget de chat en la interfaz
- Botón flotante independiente centrado en la parte superior del mapa (`top: 16px; left: 50%`), entre el botón de radio (izquierda) y el botón GPS (derecha) — mismo patrón visual que esos botones
- Icono de bot/robot (cabeza con antena y ojos), más representativo de IA que un bocadillo de chat
- Panel `#chatPanel` que cae debajo del botón desde `top: 68px`, centrado, con el mismo estilo glass que el radio panel (backdrop-filter, border, box-shadow)
- En mobile: panel se convierte en drawer desde abajo (mismo patrón que radio, search y weather panels)
- El botón actúa como toggle: abre si el panel está cerrado, cierra si está abierto
- Estado activo del botón gestionado con clase `.active` (CSS separado de `:hover` con `@media (hover: hover)` para evitar que el color se quede pegado en móvil tras el tap)

### Comportamiento de apertura
- Al abrir por primera vez (historial vacío), se envía automáticamente el mensaje "Hola!" al agente — el usuario ve directamente la respuesta del asistente sin tener que escribir nada
- Las siguientes veces que se abre, el panel retoma el historial existente sin reenviar nada

### Exclusión mutua con otros paneles
- Abrir el chat cierra: radio panel, search panel, weather panel, sun/moon panel (y desactiva sus botones)
- Abrir radio, search o sun/moon cierra el chat y desactiva su botón
- El chat no interfiere con el panel de alarma de fondeo ni con la regla náutica (herramientas de mapa que no son paneles laterales)

### Cierre
- Solo mediante la X — se descartó el swipe-to-close por conflictos con el teclado virtual del móvil (el viewport se redimensiona al cerrarse el teclado a mitad del gesto, desestabilizando la animación)
- Al cerrar, se hace `blur()` del input para cerrar el teclado

### Lógica de conversación (app.js)
- Historial de conversación mantenido en el cliente (`chatHistory[]`), se envía completo en cada petición (máximo 10 mensajes, igual que el bot de Telegram)
- Timeout de sesión de 10 minutos: si el usuario lleva más de 10 min sin escribir, el historial se limpia y el asistente avisa
- Indicador de "Escribiendo..." mientras el servidor procesa la respuesta
- Enter para enviar (sin Shift), botón deshabilitado durante la petición para evitar envíos duplicados
- URL del proxy: relativa (`/chat`) — funciona en local y vía ngrok sin modificar nada

### Servidor consolidado en puerto 5050 (server.py)
- Reemplaza `npx http-server` por un servidor FastAPI que hace las dos funciones en uno:
  1. `POST /chat` — recibe los mensajes del frontend, firma la petición con la API key y la reenvía a Open WebUI (`asistente-touron`), devuelve la respuesta
  2. `StaticFiles` en `/` — sirve todos los archivos estáticos de tsamaps (mismo comportamiento que http-server)
- CORS abierto (`allow_origins=["*"]`) para compatibilidad con ngrok
- Timeout de 120 segundos hacia Open WebUI (igual que el bot de Telegram)
- El endpoint `/chat` se registra antes del mount de StaticFiles para que tome prioridad

### Motivación del diseño consolidado
La arquitectura inicial tenía dos servicios separados: `http-server` en 5050 y un proxy Docker en 5001. Al acceder vía ngrok (HTTPS), el navegador bloqueaba las peticiones a `http://localhost:5001` por mixed content (HTTPS → HTTP) y, desde dispositivos externos, `localhost` resolvía al propio dispositivo del usuario. Consolidar ambos en un único servicio en 5050 resuelve los dos problemas con un solo túnel ngrok.

### Runtime actualizado
- `start.sh`: lanza `tsamaps_server` vía `docker compose -f proxy.yml up -d`
- `stop.sh`: para el contenedor con `docker compose -f proxy.yml stop tsamaps_server` y cierra ngrok
- La ruta al compose se resuelve con `$(dirname "$0")/../../../../.docker/compose/proxy.yml` (4 niveles desde `runtime/`)

---

## Botón MOB
- La etiqueta del botón de hombre al agua cambia de `SOS` a `MOB`

---

## Corrección botón GPS (gpsShortcutBtn)
- El botón GPS ahora actúa como toggle: abre el panel de condiciones marítimas si está cerrado, lo cierra si está abierto (antes solo abría)
- Gestión de clase `.active` añadida — el botón se ilumina al abrir y se apaga al cerrar
- CSS corregido con `@media (hover: hover)` para separar `:hover` de `.active` y evitar el color pegado en móvil

---

## Arquitectura Docker (proxy.yml)

### Estructura de compose
- Nombre del proyecto: `proxy`
- Servicio: `tsamaps_server` — sigue la misma convención que los bots (`name: bots` → `asistente_nautico`, `asistente_servicio`)
- Imagen: `python:3.11-slim`
- Puerto: `5050:5050`
- Volumen: monta `../../.webapps/dev/tsamaps` en `/app` (ruta relativa desde `.docker/compose/`)
- `extra_hosts: host.docker.internal:host-gateway` — permite al contenedor alcanzar Open WebUI en el host Windows

---

## Contexto técnico para agentes

> Stack: HTML + CSS + JS vanilla, Leaflet 1.9.4. Servidor: FastAPI + uvicorn en Docker.
> Open WebUI: `http://host.docker.internal:3000`, model ID: `asistente-touron`.
> Archivos afectados: `index.html`, `index.css`, `responsive.css`, `app.js`, `runtime/start.sh`, `runtime/stop.sh`.
> Archivos nuevos: `server.py`, `.docker/compose/proxy.yml`.

### Nuevo endpoint del servidor
```
POST /chat
Body:  { "messages": [{"role": "user", "content": "..."}, ...] }
Response: { "response": "..." }
```

### Variables de estado del chat (app.js — final del DOMContentLoaded)
- `PROXY_URL = ''` — URL relativa, no cambiar salvo arquitectura multi-servidor
- `CHAT_TIMEOUT = 10 * 60 * 1000` — reset de historial por inactividad
- `chatHistory[]` — array de mensajes `{role, content}` mantenido en el cliente
- `chatLastActivity` — timestamp del último mensaje para calcular el timeout

### Posicionamiento del chat panel
- Desktop: `position: absolute; top: 68px; left: 50%; transform: translateX(-50%)` — cae centrado bajo el botón, animación `translateY(-10px)` + `opacity: 0` al cerrar
- Mobile: `position: fixed; bottom: 0; width: 100%` — drawer desde abajo, `transform: translateY(100%)` al cerrar

### Exclusión mutua — patrón de implementación
- `openChatPanel()` cierra directamente los paneles (tiene acceso a sus variables)
- Los handlers de radio, search y sunMoon usan `document.getElementById('chatPanel/chatBtn')` para cerrar el chat (están definidos antes de las `const` del chat)

### proxy.yml
```yaml
name: proxy

services:
  tsamaps_server:
    image: python:3.11-slim
    container_name: tsamaps_server
    restart: "no"
    ports:
      - "5050:5050"
    volumes:
      - ../../.webapps/dev/tsamaps:/app
    working_dir: /app
    extra_hosts:
      - "host.docker.internal:host-gateway"
    command: sh -c "pip install fastapi uvicorn httpx -q && uvicorn server:app --host 0.0.0.0 --port 5050"
```
- El contenedor tarda ~15 segundos en arrancar la primera vez (pip install). Las siguientes veces la imagen ya tiene las dependencias cacheadas si no se recrea.

### Estructura de archivos nueva
```
.webapps/dev/tsamaps/
├── server.py               ← servidor FastAPI consolidado (nuevo)
├── runtime/
│   ├── start.sh            ← actualizado (docker compose proxy.yml)
│   └── stop.sh             ← actualizado (docker compose proxy.yml)
.docker/
└── compose/
    └── proxy.yml           ← nuevo (name: proxy → tsamaps_server)
```

---

## Infraestructura de logs y skill fin-sesion

### Nueva carpeta `.log/`
- Los changelogs de sesión se centralizan en `.log/` en la raíz de `proyectos/` — un único archivo por día (`changelog_YYYY-MM-DD.md`) con secciones por proyecto si aplica
- Reemplaza la antigua ubicación `.webapps/prod/tsamaps/logs/` — los changelogs históricos de tsamaps se han migrado a `.log/`
- Estructura plana: no hay subcarpetas por proyecto, todo convive en el mismo nivel

### Skill `fin-sesion`
- Nueva skill en `.agents/skills/fin-sesion/SKILL.md`
- Flujo: revisar `git status` + `git diff` → crear/actualizar changelog del día → proponer mensaje de commit → ejecutar commit tras confirmación del usuario
- No hace push — solo commit local
- Sigue el formato de changelogs existentes (título, secciones ##/###, sección de contexto técnico al final)

### CLAUDE.md actualizado
- Nueva entrada `.log/` en el árbol de carpetas y en la sección de detalle
- Referencia a tsamaps actualizada: ya no es app estática sino servidor FastAPI consolidado en Docker
- Convención de logs añadida a la sección de convenciones
