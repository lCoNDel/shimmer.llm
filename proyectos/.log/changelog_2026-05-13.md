# Changelog — 2026-05-13

## tsamaps + bot — Reconexión a Open WebUI dev (puerto 3002)

### Problema

Con Open WebUI prod (puerto 3000) parado y solo `open-webui-dev` (puerto 3002) activo, el chat de tsamaps y el bot de Telegram dejaron de responder con "Error al conectar con el asistente".

### Causa raíz: bug Open WebUI v0.9.4/v0.9.5 — chat_id None

En `open_webui.main:process_chat`, línea ~2013, existe el código:

```python
if not metadata['chat_id'].startswith('local:'):
```

`metadata['chat_id']` se inicializa como `form_data.pop('chat_id', None)`, por lo que es `None` cuando la llamada viene de una API externa sin ese campo. Esto genera `AttributeError: 'NoneType' object has no attribute 'startswith'` y devuelve HTTP 400.

### Cambios aplicados

**`prod/tsamaps/server.py`:**
- `OPENWEBUI_URL`: `host.docker.internal:3000` → `host.docker.internal:3002`
- `API_KEY`: actualizado a JWT de sesión (el API key `sk-...` también daba 400 por el mismo bug)
- Request `/api/chat/completions`: añadido `"chat_id": "local:tsamaps"` — workaround del bug

**`dev/tsamaps/server.py`:**
- `OPENWEBUI_URL`: `host.docker.internal:3000` → `host.docker.internal:3002`
- (el `proxy.yml` monta `prod/tsamaps`, no `dev/tsamaps` — este cambio es preventivo)

**`asistente_nautico.py`:**
- `OPENWEBUI_BASE`: `host.docker.internal:3000` → `host.docker.internal:3002`
- `OPENWEBUI_API_KEY`: `sk-86be5033063c4e1488007be92f4b2196` → `sk-894ef03db000417fa0fea94a2f1a3e13`
- **Pendiente:** añadir `"chat_id": "local:asistente-nautico"` al payload si el bot también da 400

---

## openweb — query_knowledge.py: file_filter por archivo

### Nuevo parámetro opcional `file_filter`

Añadido parámetro `file_filter: str = ""` a `query_knowledge.py` (v1.1.0 → v1.2.0).

**Comportamiento:**
- Sin `file_filter`: busca en toda la KB (comportamiento anterior intacto)
- Con `file_filter="Verado V12"`: llama a `/api/v1/knowledge/{KB_ID}/files`, busca coincidencia parcial por nombre, construye `file-{uuid}` y busca solo en esa colección
- Sin match: devuelve lista de archivos disponibles
- Error en API: cae a KB completa silenciosamente

**Limitación:** nuevas KBs requieren añadir su UUID a `COLLECTION_IDS` manualmente. Alternativa futura: listar todas las KBs via `/api/v1/knowledge/`.

**Cómo se activa:** usuario escribe "busca en el Verado V12: intervals mantenimiento" → LLM extrae nombre → `file_filter="Verado V12"`.

---

## backlog — Explicación búsqueda semántica RAG

Creado `.backlog/explicacion_busqueda_semantica_rag.md` con explicación completa del funcionamiento del RAG:
- Chunking con chunk_size=512 y overlap=100
- Vectores y embeddings (nomic-embed-text, 768 dimensiones)
- ChromaDB: texto + vector + metadata por chunk
- Similitud coseno y ángulos entre vectores
- Flujo completo de 7 pasos con ejemplo "Mantenimientos Verado V12"
- Búsqueda híbrida semántica + BM25

---

## tsamaps — Eliminación de dev/tsamaps

### Decisión

`dev/tsamaps` eliminado completamente. A partir de ahora solo existe `prod/tsamaps`, que es lo que monta el `proxy.yml`. El directorio `dev/` ha quedado vacío.

**Motivo:** el flujo de trabajo dev/prod en tsamaps no aportaba valor — `proxy.yml` siempre montó `prod/tsamaps` y los cambios se hacían directamente ahí. Mantener dos copias solo generaba confusión.

---

## bot telegram — Migración a prod + mejoras RAG y control de flujo

### Contexto

Open WebUI dev (v0.9.5) actualizado esta mañana rompió el endpoint `/api/chat/completions` para clientes externos (bug confirmado en issue #24550: respuesta async sin `choices`). Se migró todo a prod (v0.9.4) que sigue funcionando correctamente.

### Cambios en `asistente_nautico.py`

**Puerto prod:**
- `OPENWEBUI_BASE`: `host.docker.internal:3002` → `host.docker.internal:3000`

**Timeout ampliado:**
- `timeout=60` → `timeout=120` — evita cortes en consultas RAG con múltiples tool calls

**Logging mejorado:**
- Log de status y body en cada iteración del bucle (`[iter N] status=200, body=...`)
- Comprobación explícita de `"choices" not in resp_json` con error descriptivo

**Fix bucle tool calls — crítico:**
- Condición de salida cambiada de `if finish_reason != "tool_calls" or content.strip()` a `if finish_reason != "tool_calls"`
- **Motivo:** el modelo a veces emite texto parcial ("Déjame buscar...") junto con tool calls. La condición anterior salía del bucle con ese texto incompleto como respuesta final, ignorando el tool call pendiente. La corrección fuerza continuar el bucle siempre que `finish_reason == "tool_calls"`, independientemente del contenido.

**Fix footer duplicado:**
- Añadida comprobación `"📄 *Fuentes consultadas:*" not in content` antes de añadir el footer
- **Motivo:** el modelo a veces reproduce el footer de respuestas anteriores del historial, y el bot lo añadía encima generando duplicado.

**System prompt eliminado del bot:**
- `messages_with_system = [{"role": "system", "content": SYSTEM_PROMPT}] + messages` → `messages_with_system = messages`
- Todo el system prompt (datos corporativos + instrucciones RAG) se gestiona ahora desde el Workspace Model `asistente-touron` en Open WebUI

### Cambios en `prod.yml`

Branding Touron LLM aplicado a prod (antes solo en dev):
- Bind mounts: `custom.css`, `favicon.png`, `favicon-96x96.png`
- Variable: `WEBUI_NAME=Touron LLM`
- Parche `env.py` reaplicado manualmente tras recrear el contenedor

### Estado del Workspace Model `asistente-touron`

System prompt migrado al Workspace Model con estas secciones:
- Rol e identidad (Shimmer, Touron S.A.)
- Instrucciones RAG: dos llamadas separadas a `query_knowledge_files` (español + inglés, 5-10 keywords, count=15)
- Instrucciones búsqueda web: usar resultados del encabezado `"Resultados de búsqueda web para:"`, citar URLs exactas
- Datos corporativos completos: identidad, contactos, equipo, productos

---

## Contexto técnico para agentes

**Archivos modificados en esta sesión:**
- `.webapps/prod/tsamaps/server.py` — puerto 3002, JWT, chat_id workaround
- `.webapps/dev/tsamaps/server.py` — puerto 3002 (preventivo)
- `.docker/.bots/telegram/asistente_nautico.py` — puerto 3002, nueva API key
- `.docker/openweb/tools/query_knowledge.py` — v1.2.0 con file_filter
- `.log/changelog_2026-05-09.md` — actualizado con entrada query_knowledge v1.2.0
- `.backlog/explicacion_busqueda_semantica_rag.md` — nuevo documento educativo

**Bug Open WebUI v0.9.4 — chat_id:**
- El endpoint `/api/chat/completions` devuelve 400 cuando no se pasa `chat_id` en el body
- Workaround: incluir `"chat_id": "local:<nombre>"` en el JSON del request
- Afecta a llamadas externas via API key Y via JWT — el problema es el campo ausente, no la autenticación
- El bug puede estar corregido en v0.9.5 pero el workaround es inocuo en cualquier versión

**Estado de conexiones (modo dev activo):**
- Open WebUI dev: `http://host.docker.internal:3002`
- tsamaps monta `prod/tsamaps` (no `dev/tsamaps`) según `proxy.yml`
- Al volver a producción: revertir puertos a 3000 y usar API key prod en todos los servicios

**JWT en prod/tsamaps/server.py:**
- Expira aproximadamente el 13 de junio de 2026
- Cuando expire: obtener nuevo JWT desde F12 → Application → Local Storage → `localhost:3002` → clave `token`
- O esperar fix del bug API key en Open WebUI y volver a usar `sk-...`

**KB collection ID activo:**
`68e000dc-79a8-4b0f-a74d-eb9f63ce1b92` — Manuales Mercury. Si se reindexa la KB, este ID cambia y hay que actualizarlo en `query_knowledge.py` (constante `KB_ID`).

---

## tsamaps — Limpieza de referencias a dev/tsamaps eliminado

### Archivos corregidos

**`.webapps/prod/tsamaps/runtime/start.ps1`:**
- `tsamaps_server_dev` → `tsamaps_server` (el servicio dev ya no existe en `proxy.yml`)

**`.webapps/prod/tsamaps/runtime/stop.ps1`:**
- `tsamaps_server_dev` → `tsamaps_server`

**`.webapps/prod/tsamaps/Runtime.md`:**
- Rutas de scripts corregidas: `dev/tsamaps/runtime/` → `prod/tsamaps/runtime/`
- Header actualizado de "DEV" a "PROD"
- Descripción del servicio corregida a `tsamaps_server`

**`CLAUDE.md`:**
- Eliminada la línea `dev/tsamaps/` de la sección `.webapps/`

### Archivos eliminados (skill tsamaps-dev obsoleta)

- `.claude/commands/tsamaps-dev.md`
- `.claude/ops/tsamaps-dev-start.ps1`
- `.claude/ops/tsamaps-dev-stop.ps1`

El servicio `tsamaps_server_dev` fue eliminado de `proxy.yml` en sesión del 2026-05-12. La skill `tsamaps-dev` quedó rota desde entonces — estos archivos la completaban.

### Estado tras la limpieza

- Un único servicio Docker para tsamaps: `tsamaps_server` (monta `prod/tsamaps`)
- Un único comando Claude: `/tsamaps-prod`
- Scripts runtime en `prod/tsamaps/runtime/` apuntan correctamente a `tsamaps_server`
