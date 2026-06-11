# Changelog — 2026-06-11

## openweb / tools — Mejora de las tres tools experimentales (v1.1.0)

Sesión dedicada a llevar las tools de `experimental/` a nivel profesional para agentes IA. Las tres de la sesión anterior suben a v1.1.0:

### dev_read_file.py (v1.0.0 → v1.1.0)

- **Parámetro `search`** en `read_any_file`, propagado a todos los lectores: Excel/CSV filtran filas por el término, PDF escanea todas las páginas (5 snippets ±90 caracteres por página, tope 40 págs., `total_hits`), DOCX busca en párrafos y tablas, PPTX filtra diapositivas, texto/JSON/HTML devuelven líneas coincidentes (`MAX_SEARCH_MATCHES = 200`)
- **Nueva función pública `list_attachments`**: lista los adjuntos del mensaje con nombre, tipo y disponibilidad — para que el agente sepa qué tiene antes de leer
- **Fallback de codificación** `_decode()`: utf-8-sig → utf-8 → cp1252 → utf-8 errors=replace (CSVs exportados desde Excel español ya no fallan)

### dev_calculadora.py (v1.0.0 → v1.1.0)

- `quadratic(a, b, c)` — ecuaciones de 2º grado (raíces reales, doble o complejas; fallback lineal si a=0)
- `rule_of_three(a, b, c, inverse)` — regla de tres directa e inversa
- `loan(..., schedule_months)` — tabla de amortización francesa (tope 24 meses)
- `date_calc` con ops nuevas: `workdays`/`laborables` (días hábiles, divmod O(1)) y `age`/`edad` (años/meses/días exactos con `calendar.monthrange`)
- `convert` con detección de dimensión: si las unidades son de dimensiones distintas, el error lo dice explícitamente

### dev_generate_doc.py (v1.0.0 → v1.1.0)

- PDF: bloques de código ``` (Courier 8.5) y citas `> ` (cursiva con sangría)
- PPTX: las líneas `> ` van a las notas del orador (`notes_slide`)
- DOCX/PDF: los títulos limpian marcadores Markdown residuales (`_strip_md`)
- Excel (modo CSV): coerción numérica de celdas con `_coerce_number` — formato español (1.234,56) e inglés; preserva códigos con ceros a la izquierda; la cabecera no se coerciona

---

## openweb / tools — Nueva dev_query_knowledge.py (v2.0.0)

Reescritura de `stable/query_knowledge.py` (RAG de los agentes) como tool experimental. La estable queda intacta.

- **Valves configurables desde la UI** (Workspace → Tools → engranaje): `KNOWLEDGE_IDS`, `TOP_K`, `MAX_TOTAL_CHUNKS`, `MIN_CHUNK_CHARS`, `MAX_FILE_MATCHES`, `EMIT_CITATIONS`, `EMIT_STATUS` — fin de las constantes hardcodeadas
- **Búsqueda bilingüe en una sola llamada**: parámetro `query_en` opcional; pasa `queries=[query, query_en]` a `query_collection` (bge-m3 no cruza idiomas)
- **Multi-KB**: varias bases separadas por coma en `KNOWLEDGE_IDS`, o autodescubrimiento vía `/api/v1/knowledge/` si se deja vacío
- **`file_filter` multi-archivo**: busca solo en las colecciones `file-{id}` de los archivos que coinciden (tope `MAX_FILE_MATCHES`)
- **Citas y status nativos** de Open WebUI vía `__event_emitter__`, con `self.citation = False` para evitar duplicados; todo envuelto en try/except (si el esquema de eventos cambia, la tool sigue devolviendo texto)
- **Nueva función `list_knowledge()`**: lista las KBs accesibles con sus archivos
- Deduplicación de chunks por contenido normalizado (300 primeros caracteres)

---

## openweb / tools — Nueva dev_read_g3.py (v2.0.0 → v2.1.0)

Reescritura de `stable/read_g3.py` (telemetría Mercury G3, CSVs de miles de filas). Cambio de enfoque: en vez de devolver filas crudas, **agregados** — el agente nunca carga el log entero en contexto.

### v2.0.0 — Cuatro funciones de análisis

- `g3_overview` — total de filas, rango temporal, columnas, fallos detectados (ocurrencias, primera/última aparición con fila e instante), primera/última fila de muestra. El docstring obliga al agente a llamarla primero
- `g3_stats(columns)` — min/max/media/último valor por columna numérica, con la **fila y el instante** del mínimo y del máximo (clave para picos de RPM/temperatura/presión). Coincidencia parcial de nombres; sin argumento, auto-detecta numéricas (tope 30)
- `g3_trend(column, buckets)` — evolución por tramos (media/min/max con rango de filas y tiempo por tramo, defecto 20, tope 100)
- `g3_rows(filter_value, filter_column, columns, max_rows, offset)` — filas concretas con filtrado, proyección de columnas y paginación (tope 100)
- Detección de columnas de fallo por heurística (`fault`/`guardiancause` en el nombre) — superset de la whitelist `FAULT_COLUMNS` de la estable
- Multi-adjunto (`file_name`), sniffer de delimitador, decimales con coma, solo stdlib
- Probada end-to-end con CSV sintético de 5000 filas

### v2.1.0 — Tabla de fallos del manual Mercury embebida (Opción C del backlog)

El usuario aportó las págs. 3A-4 a 3A-9 del manual **Mercury Diagnostic V6/V8 (90-8M0182076, nov. 2021)**, sección "General Troubleshooting":

- **`FAULT_CODES` con 134 PCM Fault Names** — cada uno con categoría (Short Text), bocina (Critical/Caution/None), acción para el operador, descripción, resolución rápida de taller y código UFC. Verificado: 134 entradas × 6 campos
- **Nueva función `g3_fault_info(fault)`** — ficha del manual por nombre exacto, parcial o término genérico; no necesita CSV adjunto; incluye `severity` derivada (critical/caution/info)
- **`g3_overview` enriquecido** — cada fallo detectado en el CSV sale con su bloque `manual` (gravedad, categoría, acción, resolución, UFC)
- **Traducción `gc_` → `Guardian_`** — los valores de `GuardianCause` (`gc_overheat`...) resuelven contra su fallo Guardian del manual

Con esto la tool es **autónoma**: interpreta los fallos sin depender del RAG (cierra la Opción C de `.backlog/read_g3_evolución.md`).

---

## Contexto técnico para agentes

**Archivos de la sesión** (las tools de `stable/` no se tocaron):
- `.docker/openweb/tools/experimental/dev_read_file.py` (v1.1.0)
- `.docker/openweb/tools/experimental/dev_calculadora.py` (v1.1.0)
- `.docker/openweb/tools/experimental/dev_generate_doc.py` (v1.1.0)
- `.docker/openweb/tools/experimental/dev_query_knowledge.py` (v2.0.0, nueva)
- `.docker/openweb/tools/experimental/dev_read_g3.py` (v2.1.0, nueva)

**`FAULT_CODES` (dev_read_g3.py) — estructura crítica:** cada entrada es una tupla de exactamente 6 campos `(categoría, bocina, acción, descripción, resolución, UFC)`. `_fault_payload()` desempaqueta por posición — añadir entradas con otro número de campos rompe `g3_overview` y `g3_fault_info`. Las tuplas compartidas (`_CCOMM`, `_CSEN`, `_SEN`, `_INJ`, `_EST`, `_UEGO`, `_CESA`, `_CETC`, `_EPL`) aportan los primeros campos y se concatenan con `+ ("UFC",)`. Fuente: manual Mercury 90-8M0182076, sección 3A, págs. 3A-4 a 3A-9 — no inventar entradas, solo transcribir del manual.

**`_fault_lookup()` (dev_read_g3.py):** acepta match exacto (case-insensitive), prefijo `gc_` → `guardian_`, y match parcial solo si es **único** (ambiguo → None, para no etiquetar mal un fallo). El mínimo de 4 caracteres evita falsos positivos con valores cortos.

**Severidad derivada:** `critical` si bocina=="Critical" **o** la categoría empieza por "Critical" (cubre `Security_Device_Missing`, que es crítico con bocina None); `caution` si bocina=="Caution"; resto `info`.

**dev_query_knowledge.py — degradación controlada:** si los eventos de citas fallan en el 0.9.4 real, poner `EMIT_CITATIONS=false` en las Valves (la tool sigue devolviendo los chunks como texto). `KB_ID` por defecto = Manuales Mercury (`68e000dc-79a8-4b0f-a74d-eb9f63ce1b92`), igual que la estable.

**dev_read_g3.py — `g3_stats` sin columnas:** auto-detecta las numéricas mirando **solo la primera fila** (tope `MAX_STATS_COLUMNS=30`); si una columna está vacía en la fila 1 no entra en la auto-detección — pedirla explícitamente por nombre.

**Pendiente:** pegar las 5 tools en Open WebUI Dev (3002) para validación en runtime. La carpeta `.docker/openweb/tools/test_doc/` contiene documentos generados en pruebas locales — no commitear (valorar borrarla).
