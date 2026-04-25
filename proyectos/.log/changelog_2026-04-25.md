# Changelog — 2026-04-25

## Runtime tsamaps — Migración a PowerShell

### Scripts de arranque reescritos como .ps1
- `start.sh` y `stop.sh` reemplazados por `start.ps1` y `stop.ps1` en dev y prod
- Los `.ps1` usan rutas absolutas Windows y lanzan Docker + ngrok en un único paso
- Causa: la herramienta PowerShell de Claude Code no hereda el directorio de trabajo, las rutas relativas fallaban
- `Runtime.md` actualizado en dev y prod con instrucciones para el agente: usar siempre PowerShell con ruta absoluta

### server.py — Cache-Control: no-store
- Reemplazado `StaticFiles` de FastAPI por ruta genérica que sirve estáticos con cabecera `Cache-Control: no-store`
- El navegador nunca cachea — los cambios se ven al recargar sin limpiar caché
- Eliminados los `?v=N` de `index.html` (app.js, index.css, responsive.css)

---

## tsamaps dev — Correcciones UI móvil

### Panel Red de Clientes — fondo invisible en móvil
- Al pasar a `position: fixed` en móvil el panel perdía el `background` del contexto flex de desktop
- Añadido `background: rgba(255,255,255,0.95)` + `backdrop-filter` + `box-shadow` explícitos en el bloque móvil de `responsive.css`
- `z-index: var(--z-panels-mobile)` añadido para que no quede tapado por el mapa

### Panel Red de Clientes — teclado móvil
- `searchInput.focus()` se mantenía — el teclado aparece al abrir el panel

### Condiciones Marítimas + Red de Clientes — conflicto en desktop
- Al abrir Red de Clientes, Condiciones Marítimas quedaba encima
- Añadido `closeWeatherPanel()` en el listener de `openSearchBtn`
- Al cerrar Red de Clientes, Condiciones Marítimas se restaura si estaba abierto (`weatherWasOpen`)

### Iconos ancla eliminados del panel Información
- El `::before` de `.feature-list li` tenía `content: '⚓'`
- Cambiado a `content: ''` y `padding-left: 0`

---

## tsamaps dev — MOB: teléfonos de emergencia + mejoras

### Detección de aguas españolas/portuguesas
- Nueva función `isInPortugueseWaters(lat, lng)` con bounding boxes de costa continental, Madeira y Azores
- Al activar MOB: muestra **112** siempre + **900 202 202** (ES) o **1520** (PT) según coordenadas
- Botones `<a href="tel:...">` en el panel de tracking — en móvil abren la app de teléfono directamente

### Coordenadas al portapapeles automático
- Al activar MOB se copian las coordenadas con `navigator.clipboard.writeText()`
- Toast de confirmación posicionado debajo del panel MOB con `showToastAt()`

### MOB desactiva todo al activarse
- Tráfico (VesselFinder cerrado directamente sin pasar por listener), viento, radar, regla, radio
- Todos los paneles cerrados: weather, radio, search, sunmoon, chat
- VesselFinder se cierra manipulando estado directamente (`isTrafficActive = false`, `exitTrafficMode()`) para evitar el guard `isSosLocked()` que ya está activo

### VesselFinder — botón MOB siempre visible
- Eliminada la línea `sosBtnContainer.classList.add('hidden')` de `enterTrafficMode()`

---

## Bot Telegram — Refactor completo

### Acceso abierto
- `ALLOWED_USERS = None` — cualquier usuario puede usar el bot
- Todos los checks actualizados a `if ALLOWED_USERS is not None and ...`

### Teclado con botones
- `ReplyKeyboardMarkup` con `is_persistent=True`
- Botones: **🌐 Búsqueda Web** y **🗑️ Borrar Memoria**
- Al pulsar 🌐: bot pregunta "¿Qué quieres buscar?" y el siguiente mensaje se procesa como búsqueda web (`web_mode_users`)
- Al pulsar 🗑️: confirmación inline con botones **✅ Confirmar** / **❌ Cancelar** antes de borrar

### Eliminado timeout de sesión
- `TIMEOUT_MINUTES` eliminado — el historial persiste hasta que el usuario borra manualmente
- `import time` eliminado

### Mensaje de bienvenida
- `/start` responde "Shimmer Iniciado." con el teclado

### Análisis de documentos PDF
- Nuevo handler `handle_document` para `content_types=['document']`
- Extracción de texto con `pymupdf` (`fitz`)
- Flujo en dos pasos: PDF recibido → bot pregunta instrucción → usuario escribe → bot procesa
- `pdf_pending` dict para guardar el texto entre los dos mensajes
- System prompt propio para análisis de documentos (sin contaminar con el system prompt del modelo)
- `pymupdf` añadido a `requirements.txt`

---

## Backlog

- Añadido `telegram_funciones.md` con 6 ideas futuras para el bot: modo grupo, canal de alertas, alertas programadas, modo inline, documentos PDF (RAG), notas de voz

---

## Contexto técnico para agentes

> Archivos modificados: `.docker/.bots/telegram/asistente_nautico.py`, `.docker/.bots/telegram/requirements.txt`, `.webapps/dev/tsamaps/app.js`, `.webapps/dev/tsamaps/index.css`, `.webapps/dev/tsamaps/index.html`, `.webapps/dev/tsamaps/responsive.css`, `.webapps/dev/tsamaps/server.py`, `.webapps/dev/tsamaps/Runtime.md`, `.webapps/prod/tsamaps/Runtime.md`
> Archivos nuevos: `.webapps/dev/tsamaps/runtime/start.ps1`, `.webapps/dev/tsamaps/runtime/stop.ps1`, `.webapps/prod/tsamaps/runtime/start.ps1`, `.webapps/prod/tsamaps/runtime/stop.ps1`, `.backlog/telegram_funciones.md`, `.claude/commands/fin-sesion.md`

### Runtime tsamaps — comandos correctos para el agente
```powershell
# Iniciar dev
powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.webapps\dev\tsamaps\runtime\start.ps1"
# Detener dev
powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.webapps\dev\tsamaps\runtime\stop.ps1"
```

### server.py — estáticos con no-store
```python
@app.get("/{full_path:path}")
async def serve_static(full_path: str):
    path = STATIC_DIR / (full_path if full_path else "index.html")
    if path.is_dir(): path = path / "index.html"
    if not path.exists(): raise HTTPException(status_code=404)
    response = FileResponse(path)
    response.headers["Cache-Control"] = "no-store"
    return response
```

### MOB — teléfonos de emergencia
```javascript
function isInPortugueseWaters(lat, lng) { ... }
// En activateSos(): genera botones tel: según país
// Coordenadas copiadas al portapapeles automáticamente
// Toast posicionado bajo el panel MOB con showToastAt()
```

### MOB — cierre de VesselFinder sin isSosLocked()
```javascript
if (isTrafficActive) {
    isTrafficActive = false;
    toggleTrafficBtn.classList.remove('active');
    vesselFinderOverlay.classList.add('hidden');
    exitTrafficMode();
}
```

### Bot Telegram — pdf_pending
```python
pdf_pending = {}  # user_id → texto extraído del PDF
# handle_document: guarda texto, pregunta instrucción
# handle_message: si user_id in pdf_pending → procesa con instrucción del usuario
```

### Bot Telegram — web_mode_users
```python
web_mode_users = set()  # user_id en espera de consulta web
# Botón 🌐 → add(user_id) → siguiente mensaje se procesa como /web
# Botón ❌ Cancelar Búsqueda → discard(user_id) → vuelve al teclado principal
```

### Slash command /fin-sesion registrado
- Archivo: `.claude/commands/fin-sesion.md`
- Invocable con `/fin-sesion` desde Claude Code (aparece en autocompletado)
- Contenido: instrucciones de la skill `fin-sesion` sin frontmatter YAML
