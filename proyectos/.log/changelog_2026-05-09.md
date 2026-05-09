# Changelog — 2026-05-09

## Bot Telegram — asistente_nautico.py: system prompt completo

### Sustitución del system prompt minimalista por prompt completo

El system prompt del bot de Telegram se ha reescrito completamente. El anterior era una instrucción corta de RAG; el nuevo incluye identidad corporativa, equipo, productos y reglas de comportamiento completas — consolidando todo el contexto que antes dependía del agente de Open WebUI.

**Motivación:** el system prompt del agente en Open WebUI se ha vaciado. El bot ahora es autónomo y no depende de la configuración del agente en la UI para responder correctamente.

**Cambios en `SYSTEM_PROMPT`:**
- Identidad: Shimmer, asistente náutico de Touron S.A., responde en el idioma del usuario
- Reglas: sin precios, citar fuentes web, derivar a contactos cuando proceda
- Queries RAG: formato corto (3-6 palabras), dos llamadas (ES + EN), excepciones explícitas para saludos y datos ya en el prompt
- Identidad corporativa completa: NIF, fundación, grupo, cifras
- Contacto España y Portugal con teléfonos, emails y horario
- Equipo completo por departamento (incluyendo Soporte G3 Mercury: Luis Conde)
- Catálogo de productos completo: motores fueraborda, inborda, embarcaciones, SmartCraft, accesorios

### Otros cambios en asistente_nautico.py

- `search_web`: `max_results` subido de 5 a 10
- `search_web`: `backend="google"` añadido y luego revertido — no soportado en `python:3.11-slim` (primp sin binarios Google para Linux). Quedó en `auto`
- Regla de RAG ajustada: eliminada la excepción "ya buscaste en este turno" que bloqueaba preguntas de seguimiento
- Citación de fuentes web: añadida instrucción en el prompt para listar URLs al final de respuestas con búsqueda web
- Log de debug añadido: `logging.info(f"Retrieval status: {ret_resp.status_code}, response: {ret_resp.text[:300]}")` — útil para diagnosticar RAG, se puede eliminar cuando no sea necesario

---

## Open WebUI — Tools: separación doc_reader / read_g3 y renombrado

### Nueva tool: read_g3.py

Creada `.docker/openweb/tools/read_g3.py` para leer archivos CSV de diagnóstico Mercury PCM (G3 Diagnostic Tool).

**Método público:** `read_g3(filter_value=None, __files__=[], __user__={})`
- Sin `filter_value`: devuelve 3 filas de muestra + resumen de fallos (`ActiveFaultMarqueeDisp`, `GuardianCause`)
- Con `filter_value`: devuelve hasta 10 filas que contengan el valor en cualquier columna
- `NO_FAULT_VALUES = {"(none)", "none", "gc_none", "", "0"}`

### doc_reader.py revertido y renombrado → read_file.py

`doc_reader.py` revertido a comportamiento genérico de lectura de archivos (sin lógica Mercury) y renombrado a `read_file.py`.

**Cambios en `_read_csv`:** eliminada toda la lógica Mercury (FAULT_COLUMNS, fault_summary, filter_value). CSV genérico devuelve hasta `max_rows` filas (cap 100).

### doc_gen.py renombrado → generate_doc.py

Renombrado sin cambios funcionales. El `title` en el header sigue siendo "Document Generator".

---

## Open WebUI — calculadora.py: temperatura y área

### Nuevas conversiones en `convert()`

Añadidas conversiones de temperatura y área a `calculadora.py` (v1.1.0):

**Temperatura** (conversión no lineal — función propia `_TEMP_CONVERSIONS`):
- °C ↔ °F ↔ K (6 combinaciones directas)

**Área** (conversión lineal — añadida a `_CONVERSIONS`):
- m² ↔ ft² ↔ cm² (6 combinaciones)

Aliases en español e inglés añadidos a `_ALIASES` para todas las nuevas unidades.

---

## Open WebUI — Actualización a v0.9.4

### Proceso de actualización

1. Backup del volumen `open-webui` realizado antes de actualizar:
   - Archivo: `.docker/backup/open-webui-backup-20260509.tar.gz` (2,3 GB)
   - Comando: `docker run --rm -v open-webui:/data -v "C:\...\backup:/backup" alpine tar czf /backup/open-webui-backup-20260509.tar.gz /data`
2. Tag actualizado en `prod.yml`: `v0.9.2` → `v0.9.4`
3. Pull de imagen y recreación del contenedor
4. Migración de schema ejecutada automáticamente: `add pinned_note table`, `Add memory user_id index`

### Fixes relevantes para Shimmer en 0.9.3

- RAG: búsqueda en KB por título de archivo (fix #24297)
- Tools: actualización de tool code sin reiniciar (fix #24400)
- Filtros + tools custom coexistiendo (fix #24237)
- DDGS auto-backend compatibility (fix #24188)
- Markdown streaming: renderizado final forzado (fix #24088)
- Chat settings persistence: system prompt persiste tras crear chat nuevo (fix #24193)

### Signout method change (breaking para clientes externos)

El endpoint de logout cambió de GET a POST. **No afecta a Shimmer** — ningún bot ni script usa logout via API.

---

## Contexto técnico para agentes

**Archivos modificados:**
- `.docker/.bots/telegram/asistente_nautico.py` — system prompt completo, max_results=10, log debug retrieval
- `.docker/openweb/tools/calculadora.py` — temperatura (°C/°F/K) y área (m²/ft²/cm²) añadidas
- `.docker/compose/prod.yml` — imagen Open WebUI `v0.9.2` → `v0.9.4`

**Archivos nuevos:**
- `.docker/openweb/tools/read_g3.py` — tool Mercury G3 CSV (pendiente de registrar en Open WebUI)
- `.docker/openweb/tools/read_file.py` — renombrado desde doc_reader.py
- `.docker/openweb/tools/generate_doc.py` — renombrado desde doc_gen.py
- `.docker/backup/open-webui-backup-20260509.tar.gz` — backup volumen open-webui (NO incluir en git — 2,3 GB)

**Archivos eliminados:**
- `.docker/openweb/tools/doc_reader.py` → reemplazado por `read_file.py`
- `.docker/openweb/tools/doc_gen.py` → reemplazado por `generate_doc.py`
- `.docker/backup/ESTRUCTURA_Y_PROCEDIMIENTOS.txt`, `INSTRUCCIONES_SIMPLES.txt`, `scripts/` — documentación de backup obsoleta

**Estado del bot Telegram `asistente_nautico`:**
- System prompt: completo (identidad + equipo + productos + reglas RAG)
- RAG: `query_knowledge_files`, KB `68e000dc-79a8-4b0f-a74d-eb9f63ce1b92`
- Búsqueda web: DuckDuckGo `auto` backend, 10 resultados
- Log debug: activo en `run_knowledge_search()` (línea ~213) — eliminar cuando no sea necesario

**Por qué `backend="google"` no funciona en el bot:**
El contenedor del bot usa `python:3.11-slim`. La librería `primp` (dependencia de `ddgs`) se instala como wheel precompilado — el wheel para Linux x86_64 no incluye el backend Google. Open WebUI sí lo soporta porque su imagen base tiene una versión diferente de `primp` con ese backend disponible. Solución pendiente: no hay workaround sencillo sin cambiar la imagen base del bot.

**KB collection ID activo:**
`68e000dc-79a8-4b0f-a74d-eb9f63ce1b92` — Manuales Mercury. Si se reindexa la KB, este ID cambia y hay que actualizarlo en `query_knowledge.py` (línea `COLLECTION_IDS`).
