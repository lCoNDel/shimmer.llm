# Changelog — 2026-05-04

## Claude Code — Automatización de commands y ops

### Nuevos commands en `.claude/commands/`

Se crearon 5 commands que automatizan la gestión de servicios desde Claude Code. Todos siguen el patrón toggle: comprueban el estado del contenedor y actúan sin preguntar al usuario.

| Command | Contenedor | Acción |
|---|---|---|
| `/tsamaps-dev` | `tsamaps_server_dev` + ngrok | Toggle start/stop |
| `/tsamaps-prod` | `tsamaps_server_prod` + ngrok | Toggle start/stop |
| `/openweb` | `open-webui` | Toggle start/stop |
| `/anautico-tg` | `asistente_nautico` | Toggle start/stop |
| `/filebrowser` | inyección en contenedores | Ejecuta inject |

### Nueva carpeta `.claude/ops/`

Centraliza todos los scripts PowerShell operacionales. Cada command apunta a su `.ps1` correspondiente en esta carpeta. Scripts creados:

- `tsamaps-dev-start.ps1` / `tsamaps-dev-stop.ps1`
- `tsamaps-prod-start.ps1` / `tsamaps-prod-stop.ps1`
- `openweb-start.ps1` / `openweb-stop.ps1`
- `anautico-tg-start.ps1` / `anautico-tg-stop.ps1`
- `filebrowser-inject.ps1` (copia de `inject_internal.ps1`)

Los scripts de tsamaps solo gestionan su propio contenedor + ngrok — ya no arrastran `open-webui` ni `asistente_nautico` como hacían los anteriores `start.ps1` / `stop.ps1`.

---

## asistente_nautico — Correcciones RAG

### Eliminación de caché de colecciones KB

**Problema:** el bot cacheaba en memoria los UUIDs de las colecciones KB al arrancar (`_model_kb_collections`). Al recrear la Knowledge Base en Open WebUI, los UUIDs cambian — el bot seguía usando los IDs obsoletos y la búsqueda fallaba o devolvía pocos chunks sin reiniciar el contenedor.

**Solución:** eliminada la variable global de caché. `get_model_kb_collections()` consulta la API en cada llamada.

### Fallback en `get_file_content`

`view_knowledge_file` fallaba silenciosamente cuando el modelo no tiene KB asignada en su config, porque `get_file_content` no tenía el mismo fallback a `/api/v1/knowledge/` que sí tenía `run_knowledge_search`. Añadido el fallback idéntico.

### Top-k: 6 → 15

El bot pedía solo 6 chunks a la API de retrieval. El pipeline de Open WebUI (embed → reranker) devuelve hasta 15 chunks tras el reranker. Se ajustó `k: 15` para aprovechar todos los chunks disponibles.

### Eliminación de WARNING de logs

El log `"Sin colecciones KB — intentando con /api/v1/knowledge/"` se eliminó porque el fallback es el comportamiento normal (el modelo no tiene KB asignada — usa `query_knowledge_files` como tool). No era un error.

---

---

## Open WebUI — Investigación RAG con agentes externos (GPT-5.4 nano)

### Diagnóstico del problema

Sesión de investigación extensa sobre el comportamiento del RAG de Open WebUI con modelos externos (GPT-5.4 nano). Se analizaron logs en tiempo real de ChromaDB/hybrid search para identificar causas raíz.

### Hallazgos críticos: Native Function Calling (NFC)

El comportamiento del RAG varía drásticamente según el valor de NFC en la configuración del agente:

| NFC | Chunks recuperados | Comportamiento |
|---|---|---|
| **Default** | 15 (correcto) | Open WebUI controla el pipeline RAG — respeta Top K y reranker del Admin Panel |
| **ON explícito** | 1 (incorrecto) | GPT toma control de la tool call y llama `query_knowledge_files` con `top_k=1` implícito, ignorando el Admin Panel |
| **OFF** | 0 | Sin agentic tools — el modelo no puede llamar `crear_documento` ni ninguna otra tool |

**Configuración correcta para GPT-5.4 nano: NFC = Default**

### Hallazgo: modelo base vs agente

Múltiples síntomas confusos (model dice "no tengo herramientas", ignora KB, no llama tools) se explicaron por estar chateando con el **modelo base GPT-5.4 nano directamente** en lugar del agente configurado en Workspace → Models. Al seleccionar el agente correcto, todas las tools funcionaron correctamente.

### Query generation model: qwen3:1.7b problemático

El modelo configurado en Admin Panel → Documents → Query Generation Model era `qwen3:1.7b`. Se identificó que:
- Corrige nombres propios de marca: "Verado" → "verano" (Mercury Marine brand)
- Genera queries vacías `[[]]` intermitentemente por queries mal generadas
- Demasiado pequeño para dominio técnico náutico con terminología específica

**Fix aplicado en template:** añadir instrucción de preservar nombres propios. Modelo pendiente de cambiar a uno de mayor capacidad.

### RAG_SYSTEM_CONTEXT=true — probado y revertido

Se añadió `RAG_SYSTEM_CONTEXT=true` a `prod.yml` para inyectar el contexto RAG en el system message en lugar del user message. Revertido por preferencia del usuario. El archivo `prod.yml` queda sin cambios netos respecto al commit anterior.

### Propuesta de RAG template bilingüe

Template propuesto para Admin Panel → Documents → RAG Template (pendiente de aplicar por el usuario):
- `{{MESSAGES:END:1}}` en lugar de `{{MESSAGES:END:6}}` — solo analiza el último mensaje
- 2 queries forzadas: primera en inglés, segunda en español
- Límite de 5 palabras por query
- Instrucción de preservar nombres propios

### Web search: Tavily + DDGS investigados

- **Tavily**: 2 queries paralelas (`asyncio.gather`), 10 resultados por query → 20 fuentes totales. Extracción de contenido ocurre en la API de Tavily, no en el loader de Open WebUI.
- **DDGS**: meta-buscador que agrega Google, Bing, DDG, Yandex, etc. Sin API key. En algunas instalaciones usa Bing en segundo plano ([issue #16080](https://github.com/open-webui/open-webui/issues/16080)).
- **SearXNG**: opción self-hosted gratuita, agrega 70+ motores. Pendiente de evaluar añadir al stack.

---

## asistente_nautico — System prompt para forzar RAG

### Problema

El bot enviaba la consulta del usuario al modelo `asistente-touron` sin system prompt propio. El modelo de Open WebUI tiene un system prompt configurado en la interfaz, pero al llamar la API directamente el modelo no siempre decide llamar a `query_knowledge_files` — responde de memoria si considera que puede hacerlo.

Síntoma observado: logs del bot mostraban `Enviando consulta a Open WebUI` pero sin ningún `[iter N] tool_calls:` posterior. Open WebUI devolvía 200 pero el modelo respondía sin RAG.

### Solución

Añadida constante `SYSTEM_PROMPT` en `asistente_nautico.py` que se inyecta al inicio de cada llamada a `call_openwebui` sin persistirse en el historial del usuario:

```python
SYSTEM_PROMPT = (
    "Eres el asistente náutico de Touron S.A. Antes de responder cualquier pregunta técnica "
    "sobre motores, mantenimiento, repuestos, manuales o productos, DEBES llamar a la herramienta "
    "`query_knowledge_files` para buscar en la base de conocimiento. "
    "No respondas de memoria si la pregunta puede tener respuesta en los documentos."
)
```

En `handle_message`, el system prompt se antepone a los mensajes del historial en cada llamada:

```python
messages_with_system = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
answer = call_openwebui(messages_with_system, headers)
```

El historial `user_history[user_id]["messages"]` no incluye el system prompt — se aplica en vuelo en cada petición. El botón "Borrar Memoria" sigue funcionando sin afectar al system prompt.

### Resultado verificado en logs

Con el fix activo, el modelo hizo 4 iteraciones de tool calls para la query "mantenimientos de un Verado V12":
- Iter 1: query EN → 4 chunks
- Iter 2: query ES general → 4 chunks
- Iter 3: query ES específica (300h) → 4 chunks
- Iter 4: `view_knowledge_file` sobre `Verado V12 ES.pdf` → lectura directa del PDF

---

## Contexto técnico para agentes

**Archivos modificados:**
- `.docker/.bots/telegram/asistente_nautico.py`
- `.docker/compose/prod.yml` — sin cambios netos (`GLOBAL_LOG_LEVEL=INFO` añadida y revertida: es el valor por defecto de Open WebUI, redundante)

**Archivos nuevos:**
- `.claude/commands/tsamaps-dev.md`
- `.claude/commands/tsamaps-prod.md`
- `.claude/commands/openweb.md`
- `.claude/commands/anautico-tg.md`
- `.claude/commands/filebrowser.md`
- `.claude/ops/` — 9 scripts `.ps1`

**NFC Default vs ON en GPT — por qué importa:**
Con NFC=ON explícito, GPT-5.4 nano llama a `query_knowledge_files` como tool call propia y pasa `top_k` implícito de 1, ignorando completamente el Top K=30 y reranker=15 del Admin Panel. Con NFC=Default, Open WebUI mantiene control del pipeline RAG y respeta la configuración. Este comportamiento está documentado en [issue #15173](https://github.com/open-webui/open-webui/issues/15173) y [#21164](https://github.com/open-webui/open-webui/issues/21164).

**RAG template actual (Admin Panel → Documents):**
Plantilla original `{{MESSAGES:END:6}}` con instrucción adicional de preservar nombres propios. Pendiente migrar a versión bilingüe EN/ES con `END:1` y límite de 5 palabras.

**Por qué el modelo `asistente-touron` no tiene KB asignada:**
Es intencionado. El bot fuerza el uso de `query_knowledge_files` como tool call explícita en lugar del RAG nativo de Open WebUI. El fallback a `/api/v1/knowledge/` lista todas las KBs disponibles en la instancia y usa esas colecciones. `KB collections del modelo: []` en los logs es normal, no un error.

**Por qué `k: 15` y no más:**
El reranker de Open WebUI está configurado para devolver máximo 15 chunks. Pedir más de 15 no añade chunks — devuelve los mismos 15. Si se cambia el reranker top-k en Open WebUI, actualizar este valor en consecuencia.

**Flujo de colecciones en cada tool call:**
1. `get_model_kb_collections()` → consulta `/api/v1/models/model?id=asistente-touron` → devuelve `[]`
2. Fallback → consulta `/api/v1/knowledge/` → obtiene lista de KBs (`245f2ffa`, `ea80e4f0`, ...)
3. Búsqueda sobre esas colecciones con `k: 15, hybrid: True`

**Por qué el SYSTEM_PROMPT se inyecta en vuelo y no se guarda en user_history:**
El historial del usuario se persiste en memoria durante la sesión del contenedor. Si el system prompt se guardase en `user_history`, los 10 mensajes de contexto (`messages[-10:]`) podrían incluirlo varias veces al acumularse. Al inyectarlo en vuelo (`[{"role": "system", ...}] + messages`), siempre aparece exactamente una vez al inicio de cada llamada a la API, independientemente de la longitud del historial.

**count:5 en query_knowledge_files vs k:15 en Open WebUI:**
El argumento `count` que pasa el modelo en la tool call es una sugerencia, pero el número real de chunks devueltos lo controla el pipeline de Open WebUI (reranker top-k=15). En los logs de esta sesión se observó que con `count:5` se devolvieron 4 chunks — el reranker filtró por score. Si se necesitan más chunks por búsqueda, no basta con subir `count` en el bot; hay que revisar el threshold de score en el reranker de Open WebUI.

---

## asistente_nautico — Mejoras RAG (segunda sesión 2026-05-04)

### count:15 forzado en SYSTEM_PROMPT

El modelo usaba `count:5` por defecto al llamar `query_knowledge_files`. Añadida instrucción explícita en `SYSTEM_PROMPT`: `"Cuando llames a query_knowledge_files, usa siempre count=15."` El modelo lo respeta — confirmado en logs (`count:15` en todas las tool calls posteriores). El número real de chunks devueltos sigue dependiendo del reranker (threshold 0.3), no del count.

**Verificado:** con query larga y específica se alcanzaron 15 chunks en una sola búsqueda. Scores: 0.988 → 0.532 (último chunk raspando el threshold).

### `view_file` mapeada en execute_tool_calls

El modelo llamaba ocasionalmente `view_file` (tool nativa de Open WebUI) que el bot no implementaba. Identificado en `builtin.py` del contenedor `open-webui`: `view_file(file_id, offset, max_chars)` espera UUID del archivo, igual que `view_knowledge_file`. Añadido como alias en `execute_tool_calls`:

```python
if name in ("view_knowledge_file", "view_file"):
```

### Citas de fuente inline en respuestas

Añadida instrucción en `SYSTEM_PROMPT` para que el modelo cite el nombre del documento entre paréntesis al final de cada párrafo: `(Verado V12 ES.pdf)`. Permite al usuario identificar de qué documento proviene cada afirmación cuando se consultan múltiples fuentes simultáneamente.

Alternativa descartada: citas numéricas `[1]`, `[2]` — el modelo las usaba correctamente pero el usuario no podía relacionar el número con la página sin leer el footer.

### parse_mode='Markdown' en mensajes de Telegram

Activado `parse_mode='Markdown'` (v1) en todos los `bot.send_message` y `bot.reply_to` que envían respuestas del modelo. Los mensajes de sistema (errores, confirmaciones) se dejan sin parse_mode para evitar fallos por caracteres especiales.

MarkdownV2 descartado: requiere escapar `.`, `(`, `)`, `-`, `!` — inviable con respuestas generadas por LLM.

---

## tsamaps (dev) — UX móvil

### Teclado no se abre al abrir Red Náutica en móvil

En `app.js`, el `searchInput.focus()` al abrir el panel de distribuidores se ejecutaba siempre, abriendo el teclado virtual en móvil/tablet. Condicionado a `window.innerWidth > 768`:

```js
if (window.innerWidth > 768) searchInput.focus();
```

En desktop el comportamiento no cambia. En móvil/tablet el panel se abre sin activar el teclado — solo se abre si el usuario toca el input manualmente.

---

## Contexto técnico para agentes (actualización)

**SYSTEM_PROMPT actual completo:**
```python
SYSTEM_PROMPT = (
    "Eres el asistente náutico de Touron S.A. Antes de responder cualquier pregunta técnica "
    "sobre motores, mantenimiento, repuestos, manuales o productos, DEBES llamar a la herramienta "
    "`query_knowledge_files` para buscar en la base de conocimiento. "
    "No respondas de memoria si la pregunta puede tener respuesta en los documentos. "
    "Cuando llames a `query_knowledge_files`, usa siempre count=15. "
    "Al redactar la respuesta, cita el nombre del documento fuente entre paréntesis al final de cada párrafo o afirmación, "
    "por ejemplo: (Verado V12 ES.pdf) o (875_Sundeck_ES.pdf). Usa el nombre exacto que aparece en los resultados de búsqueda."
)
```

**Por qué count=15 en el SYSTEM_PROMPT y no hardcodeado en run_knowledge_search:**
El `count` lo pasa el modelo como argumento en la tool call — el bot no lo controla directamente. `run_knowledge_search` ya tiene `k: 15` hardcodeado para la llamada al reranker, pero el modelo decide cuántos pedir. Sin la instrucción en el SYSTEM_PROMPT, el modelo elige `count:5` por defecto.

**Por qué el número de chunks real no coincide siempre con count=15:**
El reranker filtra por score (threshold 0.3 en Admin Panel). Con queries genéricas o cortas, pocos chunks superan el threshold — se devuelven 4-6 aunque se pidan 15. Con queries largas y específicas (muchos términos del dominio), más chunks superan el threshold — se alcanzan los 15. El techo real es el `reranker top-k` de Open WebUI (actualmente 15).

**Builtin tools de Open WebUI relevantes para RAG (de `/app/backend/open_webui/tools/builtin.py`):**
- `query_knowledge_files(query, count)` — búsqueda híbrida semántica+BM25
- `view_knowledge_file(file_id, offset, max_chars)` — lectura por UUID
- `view_file(file_id, offset, max_chars)` — igual, alias más genérico
- `search_knowledge_files(query, knowledge_id, count)` — búsqueda por nombre de archivo
- `list_knowledge_bases(count, skip)` — lista KBs accesibles
- Si el modelo llama otras tools no implementadas en el bot, caen en el handler genérico de búsqueda y devuelven "No se encontró query en los argumentos".
