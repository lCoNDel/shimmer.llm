# Changelog — 2026-04-29

## Bot Telegram — `asistente_nautico.py`

### Diagnóstico: RAG no devolvía datos desde Open WebUI

El bot enviaba preguntas a Open WebUI pero recibía respuestas vacías al usar un modelo con native function calling activado. Causa raíz: cuando `function_calling: native` está activo en Open WebUI, la API devuelve `finish_reason: "tool_calls"` al cliente externo en lugar de ejecutar las herramientas server-side (comportamiento distinto al que ocurre en la UI). El bot solo leía `choices[0].message.content`, que en ese caso viene vacío.

### Implementación del ciclo de tool calls (RAG pipeline)

Reescritura mayor de `asistente_nautico.py` (+320/-48 líneas) para implementar el ciclo completo de ejecución de herramientas en el lado del cliente.

**Nuevas funciones:**

- `get_model_kb_collections(headers)` — consulta `GET /api/v1/models/model?id={MODEL_ID}` y extrae `data["meta"]["knowledge"]` para obtener los IDs de colecciones KB. Resultado cacheado globalmente.
- `run_knowledge_search(query, headers)` — ejecuta búsqueda híbrida en `POST /api/v1/retrieval/query/collection` con `k=6, hybrid=True`. Registra cada chunk en `_session_chunks` con índice global incremental.
- `get_file_content(file_name_or_id, headers, max_chars, offset)` — maneja el tool call `view_knowledge_file` listando archivos KB y recuperando contenido.
- `execute_tool_calls(tool_calls, headers)` — enruta `view_knowledge_file` a `get_file_content`, el resto extrae argumento `query` y llama `run_knowledge_search`.
- `call_openwebui(messages, headers)` — bucle hasta 8 iteraciones: detecta `finish_reason: "tool_calls"`, ejecuta herramientas, construye mensajes de seguimiento, y en la respuesta final añade pie de citas.

**Estado de variables por sesión:**
```python
_session_chunks: list = []        # chunks recuperados, con índice global
_session_chunk_counter: int = 0   # reiniciado al inicio de cada call_openwebui()
```

**Comportamiento de qwen3.5 en modo native:** el modelo reformula la consulta del usuario antes de lanzarla al sistema de embeddings (ej: "verado v12 mantenimientos" → "mantenimiento Verado V12 programa mantenimiento calendario"). Esto es comportamiento normal del modelo, no un bug.

### Sistema de citas

Open WebUI devuelve referencias `[N]` en el texto final cuando recupera chunks del RAG. El bot:
1. Parsea el texto final con `re.findall(r'\[(\d+)\]', content)` para detectar qué chunks fueron realmente citados.
2. Si hay citas explícitas: muestra los documentos específicos citados.
3. Si no hay citas: lista los documentos únicos recuperados durante la sesión.

### Fixes durante el desarrollo

| Error | Causa | Fix |
|---|---|---|
| `data["meta"]["knowledge"]` vacío | Ruta incorrecta — se usaba `data["info"]["meta"]` | Corregido a `data.get("meta", {}).get("knowledge", [])` |
| `'str' object has no attribute 'get'` | Items del knowledge list eran strings en lugar de dicts | Guard `isinstance(kb, str)` |
| `/api/v1/knowledge/` devuelve dict, no lista | Formato paginado `{"items": [...], "total": N}` | `items = kbs.get("items", [])` |
| `TypeError: 'NoneType' is not iterable` en `get_file_content` | `kb_data.get("files", [])` devolvía `None` | `files = kb_data.get("files") or []` |
| `import re` dentro de función | `import re` estaba dentro de `call_openwebui()` | Movido al top del archivo |
| Timeout en `default` function calling | `default` mode >120s con RAG complejo | Cambiado a `native` + ejecución client-side |

### Ajustes generales

- `MODEL_ID` cambiado a `"test"` (agente de pruebas) — **pendiente cambiar a `"asistente-touron"` para producción**
- Todos los `timeout` de requests: 120s → 300s
- `logging.basicConfig(level=logging.INFO)` — se usó DEBUG durante debugging, restaurado a INFO
- Logging añadido antes y después de la llamada a Open WebUI en `handle_photo`
- Comentarios en español en todo el archivo

### PENDIENTE — Handler de fotos roto con modelo `test`

**Síntoma:** el bot recibe la foto (confirmado por logging: `Imagen descargada: 57290 bytes`) y la envía a Open WebUI, pero no devuelve respuesta. El bot queda bloqueado esperando.

**Causa identificada:** el modelo `test` usa `qwen3.5:latest` como base (`"base_model_id": "qwen3.5:latest"`), que es **texto únicamente** — no soporta visión. Open WebUI no puede procesar la imagen y no devuelve respuesta coherente.

**No es un bug de código** — el flujo de `handle_photo` es correcto. El problema es la selección del modelo base.

**Acción pendiente:** cambiar `MODEL_ID` de `"test"` a `"asistente-touron"` (o cualquier modelo con capacidad multimodal, ej. `llava`, `minicpm-v`, `qwen2.5-vl`). Una vez restaurado `asistente-touron`, verificar también si el knowledge base sigue correctamente asignado (hay un bug conocido de Open WebUI donde modelos creados en versiones antiguas no guardan correctamente las KB — issues #22213, #17514).

---

## Contexto técnico para agentes

**Archivo principal:**
- `.docker/.bots/telegram/asistente_nautico.py`

**Constantes clave:**
```python
OPENWEBUI_BASE = "http://host.docker.internal:3000"
OPENWEBUI_URL = f"{OPENWEBUI_BASE}/api/chat/completions"
MODEL_ID = "test"  # CAMBIAR a "asistente-touron" en producción
```

**APIs Open WebUI usadas:**
- `GET /api/v1/models/model?id={MODEL_ID}` → `data["meta"]["knowledge"]` — IDs de colecciones KB
- `POST /api/v1/retrieval/query/collection` con `{collection_names, query, k=6, hybrid=True}` — búsqueda RAG
- `GET /api/v1/knowledge/` → `{"items": [...], "total": N}` — lista de KBs (paginada)
- `GET /api/v1/knowledge/{kb_id}` → archivos de una KB específica

**Modelo de datos de chunks:**
```python
_session_chunks = [
    {"index": 1, "doc": "nombre_archivo.pdf", "content": "texto del chunk..."},
    ...
]
```

**Flujo de native function calling:**
1. Bot envía mensaje a `/api/chat/completions`
2. Open WebUI responde con `finish_reason: "tool_calls"` y lista de `tool_calls`
3. Bot ejecuta cada tool call contra la API de retrieval
4. Bot reenvía resultados como mensajes `role: "tool"` en el mismo hilo
5. Modelo genera respuesta final con `finish_reason: "stop"`
6. Bot parsea citas `[N]` y construye pie de fuentes
