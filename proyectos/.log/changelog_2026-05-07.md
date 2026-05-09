# Changelog — 2026-05-07

## Open WebUI — Nueva tool doc_reader y renombrado doc_gen

### Nueva tool: `doc_reader.py`

Nueva herramienta para Open WebUI que lee archivos adjuntos al chat y devuelve su contenido estructurado al modelo. Permite que el agente procese archivos subidos directamente en la conversación sin depender del pipeline RAG nativo.

**Formatos soportados:** `.xlsx`, `.xls`, `.xlsm`, `.docx`, `.pdf`, `.txt`, `.csv`, `.md`

**Resolución de ruta:** usa `__files__` y `__user__` inyectados por Open WebUI. Busca primero por `file_id` (prefijo del filename en `/app/backend/data/uploads`) y hace fallback por nombre de archivo.

**Por formato:**
- **Excel:** devuelve headers + filas como array de dicts JSON. Soporta `sheet_name` y `max_rows`. Ignora filas completamente vacías.
- **Word (.docx):** devuelve párrafos no vacíos + tablas como arrays anidados.
- **PDF:** devuelve texto por página + `full_text` concatenado (usando `pypdf`).
- **Texto / Markdown:** devuelve contenido verbatim + conteo de líneas.
- **CSV:** devuelve headers + filas como array de dicts JSON con `max_rows`.

**Decisión de diseño — cuándo es útil frente al RAG nativo:**
- Útil para Excel y CSV (el RAG nativo no indexa bien tablas estructuradas).
- Útil cuando el usuario quiere procesar el archivo completo de una sola vez (no búsqueda semántica).
- Redundante para PDF y Word cuando el documento ya está en la Knowledge Base — el RAG via `query_knowledge_files` es más eficiente en esos casos.
- No se añadió al system prompt del Asistente Náutico (no aplica para ese agente).

### Renombrado: `generacion_documentos.py` → `doc_gen.py`

Renombrado para alinear la nomenclatura de las tools con el patrón `doc_*`. El contenido es idéntico al commit anterior — no hay cambios funcionales.

**Pendiente:** registrar `doc_gen.py` en Open WebUI (reemplaza a `generacion_documentos.py`).

---

## Open WebUI — Variable de entorno DDGS_BACKEND

Añadida `DDGS_BACKEND=google` al servicio `open-webui` en `.docker/compose/prod.yml`.

Fuerza que la búsqueda web (DuckDuckGo Search) use el backend de Google en lugar del predeterminado. Necesario porque el backend DuckDuckGo directo fallaba intermitentemente con errores de rate limiting.

---

## Asistente Náutico — Diagnóstico RAG y refinamiento de system prompt

Sesión de diagnóstico extensa sobre el comportamiento del agente. No hay cambios en archivos de código, pero sí en el system prompt almacenado en Open WebUI (no versionado en git).

### Problema investigado: modelo llama a `view_knowledge_file` tras recibir chunks

El agente, tras recibir resultados de `query_knowledge_files`, escalaba a `view_knowledge_file` y leía el PDF completo (226.173 chars, `truncated=true`). Esto saturaba el contexto y no ocurría hace días.

**Hallazgos:**
- `view_knowledge_file` es una herramienta nativa de Open WebUI disponible en modo Native FC. Devuelve hasta 100.000 chars del archivo completo.
- El modelo (qwen3.5:9b) decide llamarla cuando interpreta que los chunks no son suficientes o cuando una de las dos queries paralelas devuelve `[]`.
- La query en inglés **siempre devuelve `[]`** para el `Verado V12 ES.pdf` — el PDF es en español y bge-m3 no matchea queries en inglés contra chunks en español semánticamente.
- Tener una query que devuelve vacío le da al modelo la "excusa" de cobertura insuficiente para escalar a `view_knowledge_file`.

**Cambio en `ENABLE_RETRIEVAL_QUERY_GENERATION`:** estaba activo con una plantilla de prueba (queries en chino/japonés) — desactivado durante la sesión.

**Fix aplicado en system prompt (Open WebUI):**
- Regla `view_knowledge_file` cambiada de condicional a prohibición absoluta con justificación técnica.
- Propuesta: cambiar las 2 queries paralelas de ES+EN a **2 queries en español con formulaciones distintas** — elimina el resultado `[]` que confunde al modelo.

### Arquitectura Open WebUI clarificada

- **Task Model (qwen3:1.7b):** solo afecta al pipeline RAG nativo (adjuntos `#`) y a generación de títulos/tags. No interviene en herramientas Python (`query_knowledge_files`, `generate_excel`, etc.).
- **`ENABLE_RETRIEVAL_QUERY_GENERATION`:** solo afecta al RAG nativo. No afecta a las tool calls del modelo principal.
- **Native vs Default FC:** en Native, `view_knowledge_file` está disponible como herramienta del sistema. En Default, no.
- **Docstrings de las tools:** Open WebUI expone al modelo únicamente el nombre de la función, el docstring y los parámetros. El cuerpo del `.py` no se envía al modelo. Por eso los docstrings deben ser descriptivos y precisos.

---

---

## Open WebUI — Nueva tool `query_knowledge.py` y fix `view_knowledge_file`

### Problema raíz confirmado

Open WebUI v0.9.0 cambió cómo inyecta las herramientas del bloque Built-in Knowledge: expone `query_knowledge_files` **y** `view_knowledge_file` juntas, sin posibilidad de desactivar una sola. El modelo (qwen3:9b) escala a `view_knowledge_file` cuando una de las dos queries paralelas devuelve `[]` — interpreta cobertura insuficiente y lee el PDF completo (226.173 chars, `truncated=true`), saturando el contexto.

### Solución: tool Python custom `query_knowledge.py`

Creada la herramienta `.docker/openweb/tools/query_knowledge.py` que reemplaza completamente el bloque Built-in Knowledge. Al usar la tool custom, el agente ya no tiene `view_knowledge_file` en su espacio de herramientas.

**Decisiones de diseño clave:**

- **API interna `query_collection`** — usa `from open_webui.retrieval.utils import query_collection` con `__request__.app.state.EMBEDDING_FUNCTION`. No HTTP, no token — llama directamente a ChromaDB. Más fiable dentro del contenedor.
- **Ejecución secuencial** — `asyncio.gather` causaba race condition en `embedding_function` (una query devolvía `[]`). Las dos llamadas van secuenciales: ES primero, EN después.
- **COLLECTION_IDS hardcodeados** — `ea80e4f0-ac8a-49c5-8025-9b7dc1ee763e` (Manuales Mercury) y `245f2ffa-13ce-4c98-97fa-a6d2efdcf885` (G3).
- **COUNT = 15** — top-k por query. Con 2 queries y deduplicación, devuelve hasta ~20-25 chunks únicos.
- **Limpieza de metadata noise** — Open WebUI inyecta `Filename:/Title:/Source:` en los chunks durante la indexación. Eliminados con regex antes de devolver al modelo.
- **Footer de citas obligatorio** — el modelo ignoraba las instrucciones de citación del system prompt. Se embebe directamente en el output de la tool: `AL FINAL DE TU RESPUESTA CITA OBLIGATORIAMENTE: 📄 <fuente> (p. X)`. Confirmado funcionando.

**Configuración en el agente (Open WebUI):**
- Bloque **Built-in Knowledge**: desactivado
- Tool **query_knowledge**: activada en el Workspace del agente
- Modo FC: **Native** — mejor calidad de tool calls con qwen3:9b
- **Herramientas integradas**: todas desactivadas en la plantilla del agente (parámetros avanzados) — así `view_knowledge_file` no aparece en el espacio de herramientas aunque el modo sea Native. `query_knowledge` es la única tool disponible.

### System prompt del agente `asistente-touron` (no versionado en git)

Actualizado durante la sesión. Cambios respecto al anterior:
- Eliminada regla de citación (la gestiona la tool via footer)
- Añadida instrucción de formato de query: "3-6 palabras clave, nunca frases completas"
- `view_knowledge_file`: prohibición absoluta con justificación técnica explícita

---

## Contexto técnico para agentes

**Archivos modificados en git:**
- `.docker/compose/prod.yml` — añadida `DDGS_BACKEND=google` en el servicio `open-webui`
- `.docker/openweb/tools/generacion_documentos.py` — ELIMINADO (renombrado a `doc_gen.py`)

**Archivos nuevos sin stagear:**
- `.docker/openweb/tools/doc_gen.py` — tool generador de documentos (mismo contenido que `generacion_documentos.py`)
- `.docker/openweb/tools/doc_reader.py` — nueva tool lectora de archivos adjuntos
- `.docker/openweb/tools/query_knowledge.py` — nueva tool RAG custom (v9.0, reemplaza Built-in Knowledge)

**Pendientes de registro en Open WebUI:**
- Desregistrar `generacion_documentos.py` y registrar `doc_gen.py` (requirements: `python-docx, openpyxl`)
- Registrar `doc_reader.py` si se decide activar (requirements: `openpyxl, python-docx, pypdf`)
- `query_knowledge.py` ya está registrada y activa en el agente `asistente-touron`

**Por qué `DDGS_BACKEND=google`:**
DuckDuckGo tiene rate limiting agresivo en su backend propio. El backend de Google (también disponible en la librería `duckduckgo-search`) tiene mayor fiabilidad. Si se resetea el compose, esta variable debe estar presente o las búsquedas web fallarán intermitentemente.

**Por qué las queries son secuenciales y no paralelas (`asyncio.gather`):**
`embedding_function` es un objeto con estado interno que no soporta llamadas concurrentes desde la misma instancia de la tool. Con `gather`, una de las dos queries siempre devolvía `[]`. Con llamadas secuenciales (ES → EN), ambas devuelven resultados correctos.

**Por qué el footer de citas va en el output de la tool y no en el system prompt:**
El modelo ignora las instrucciones de citación cuando están en el system prompt si los chunks no contienen explícitamente el formato esperado. Embeber la instrucción directamente en el output de la tool (como si fuera parte de los datos recibidos) fuerza el comportamiento de forma fiable.

**ChromaDB — colecciones activas:**
- `Verado V12 ES.pdf`: 576 chunks, 122 páginas, 226.173 chars — embeddings bge-m3, hybrid search BM25+vector
- IDs de colección: `ea80e4f0-ac8a-49c5-8025-9b7dc1ee763e` (Manuales Mercury), `245f2ffa-13ce-4c98-97fa-a6d2efdcf885` (G3)
- Threshold relevancia: 0.5, top_k: 30, top_k_reranker: 15
- Queries en inglés para PDFs en español: siempre `[]` con bge-m3 — no hay match semántico cross-language
