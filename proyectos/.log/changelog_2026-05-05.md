# Changelog — 2026-05-05

## asistente_nautico — Aislamiento de sesión RAG y mejoras de estabilidad

### Race condition: variables globales → locales

**Problema:** `_session_chunks` y `_session_chunk_counter` eran variables globales en `asistente_nautico.py`. Con múltiples usuarios usando el bot simultáneamente, las referencias a los chunks de una sesión se mezclaban con las de otra — el footer de fuentes podía mostrar citas de una consulta anterior de otro usuario.

**Solución:** variables convertidas a locales en `call_openwebui()`:

```python
session_chunks: list = []
session_chunk_counter: list = [0]
```

Se usa `list = [0]` en lugar de `int = 0` para permitir mutación desde funciones anidadas sin `nonlocal`. Las firmas de `run_knowledge_search` y `execute_tool_calls` reciben ambas variables como parámetro. Cada llamada a `call_openwebui` tiene su propio espacio de chunks — sesiones simultáneas no se interfieren.

### Fallback Markdown en mensajes del bot

**Problema:** `parse_mode='Markdown'` (v1) activado en la sesión anterior fallaba con `TelegramApiError` cuando el modelo generaba `*` o `` ` `` sin cerrar (offset 1838 o similar). El bot lanzaba excepción y el usuario no recibía respuesta.

**Solución:** bloque try/except en el `send_message` final:

```python
try:
    bot.send_message(message.chat.id, answer, parse_mode='Markdown', reply_markup=main_keyboard())
except Exception:
    bot.send_message(message.chat.id, answer, reply_markup=main_keyboard())
```

Si Telegram rechaza el Markdown, el mensaje se reenvía como texto plano sin perder la respuesta. MarkdownV2 descartado — requiere escapar `.`, `(`, `)`, `-`, `!`, inviable con texto generado por LLM.

### Ejemplos de filenames en SYSTEM_PROMPT

Los ejemplos `(Verado V12 ES.pdf) o (875_Sundeck_ES.pdf)` en la instrucción de citas inline se reemplazaron por `(Documento1.pdf) o (Documento2.pdf)` para no exponer nombres de archivos internos de Touron en el prompt.

---

## Document Generator (Open WebUI) — Formato enriquecido en DOCX

### Negrita e cursiva inline en párrafos

**Problema:** `generate_docx` usaba `doc.add_paragraph(text)` directamente — el texto `**negrita**` se copiaba literal al Word sin aplicar el estilo.

**Solución:** dos helpers nuevos:

```python
def _add_inline_runs(para, text: str):
    tokens = re.split(r'(\*\*.*?\*\*|\*.*?\*)', text)
    for token in tokens:
        if token.startswith("**") and token.endswith("**"):
            para.add_run(token[2:-2]).bold = True
        elif token.startswith("*") and token.endswith("*"):
            para.add_run(token[1:-1]).italic = True
        elif token:
            para.add_run(token)

def _add_paragraph_with_inline(doc, text, style=None):
    para = doc.add_paragraph(style=style) if style else doc.add_paragraph()
    _add_inline_runs(para, text)
    return para
```

Todos los párrafos normales y listas de `generate_docx` usan `_add_paragraph_with_inline` en lugar de `doc.add_paragraph`.

### Tablas Markdown en DOCX

**Problema:** bloques de tabla Markdown (`| col1 | col2 |`) se volcaban como texto literal.

**Solución:** la función `generate_docx` se reescribió con un `while` + índice `i` (en lugar de `for line in lines`) para poder consumir varias líneas consecutivas al detectar una tabla:

- Detecta inicio de tabla: `line.startswith("|") and line.endswith("|")`
- Acumula todas las líneas `|...|` contiguas
- Filtra la fila separadora (`|---|---|`) con `re.match(r'^\|[-| :]+\|$', r)`
- Crea `doc.add_table(rows=N, cols=M)` con estilo `"Table Grid"`
- Primera fila en negrita automáticamente
- Cells procesadas con `_add_inline_runs` (soportan negrita/cursiva dentro de celdas)

---

## tsamaps (dev) — Declinación magnética en la regla náutica

### Rumbo verdadero y magnético en tiempo real

La regla náutica mostraba solo el rumbo verdadero (°V). Se añadió declinación magnética via API NOAA para mostrar también el rumbo magnético (°M).

**Nueva variable de estado:**

```javascript
let rulerDeclination = null;
```

**Nueva función `fetchDeclination(lat, lng)`:**

```javascript
async function fetchDeclination(lat, lng) {
    const url = `https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination?lat1=${lat}&lon1=${lng}&resultFormat=json&model=WMM`;
    const r = await fetch(url);
    const data = await r.json();
    return data.result[0].declination; // grados, positivo=Este
}
```

La función hace una sola llamada al activar la regla (centro del mapa). El valor se cachea en `rulerDeclination` para toda la sesión de la regla — sin llamadas repetidas en cada movimiento del ratón.

**Nueva función `buildRulerContent(distanceNM, bearingTrue, declination)`:**

Genera el HTML del panel flotante de la regla. Si `declination !== null`, muestra `Rumbo: 045°V (047°M)` y `Dec: +2.1°E`. Si la API falla (offline o timeout), muestra solo `Rumbo: 045°V` sin línea de declinación — la regla sigue funcionando con degradación elegante.

**Integración en el flujo de la regla:**
- Al activar la regla: `fetchDeclination(center.lat, center.lng).then(dec => { rulerDeclination = dec; })`
- El hover (mousemove) y el clic final usan `buildRulerContent()` en lugar de construir el HTML inline
- `clearRuler()` resetea `rulerDeclination = null`

**Curvatura de la tierra:** `getBearing()` ya usa la fórmula de rumbo esférico (coordenadas geográficas en radianes) — la curvatura queda implícita. No era necesario adaptar la fórmula.

---

## 00_memoria.html — Actualizaciones de documentación

### Document Generator añadido a la tabla de Agentes

Nueva fila en la tabla de agentes/tools con las 7 funciones disponibles: Word (.docx), Excel (.xlsx), CSV, TXT, Markdown (.md), JSON, XML. Descripción de cada formato.

### Agente Telegram actualizado

Descripción ampliada con el detalle del motor RAG: búsqueda híbrida (semántica + BM25), 15 chunks por búsqueda, footer de fuentes por doc, aislamiento por sesión de usuario.

### Sigla RAG expandida

Añadido `(Recuperación Aumentada por Generación)` a continuación de la primera mención de "RAG" en el documento.

---

## Backlog — Navegación a Destino (tsamaps)

Guardada idea en `.backlog/tsamaps_navegacion_destino.txt`: función de navegación activa con GPS, punto de destino en el mapa, distancia en NM y rumbo verdadero/magnético actualizados en tiempo real con cada tick GPS, línea visual barco→destino y panel flotante con botón cancelar.

---

## Document Generator (Open WebUI) — Bug fixes de seguridad y robustez

### Fix: XSS en filename dentro del iframe HTML/JS

`_download_iframe` insertaba el filename sin escapar en el HTML (`<div class="filename">{filename}</div>`) y en el atributo JS (`a.download = "{filename}"`). Un filename con `"` o `\` podía romper el JS o inyectar HTML.

**Solución:** dos variables de escape al inicio de `_download_iframe`:

```python
filename_html = filename.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
filename_js = filename.replace("\\", "\\\\").replace('"', '\\"')
```

`filename_html` se usa en el div, `filename_js` en el atributo `a.download`.

### Fix: detección de extensión cuando el filename no tiene punto

```python
# Antes
ext = filename.rsplit(".", 1)[-1].upper()  # devolvía el nombre completo si no había punto

# Después
parts = filename.rsplit(".", 1)
ext = parts[-1].upper() if len(parts) > 1 else "FILE"
```

### Fix: regex de separador de tabla Markdown en DOCX

La regex `r'^\|[-| :]+\|$'` no filtraba variantes con espacios como `| --- | --- |`.

```python
# Antes
rows = [r for r in table_lines if not re.match(r'^\|[-| :]+\|$', r)]

# Después
rows = [r for r in table_lines if not re.match(r'^\|[\s\-:| ]+\|$', r)]
```

### Fix: Excel con `;` como separador (docstring + llamada csv.reader)

`generate_excel` usaba `,` como separador (default de `csv.reader`), lo que partía campos con comas (nombres, listas). Cambiado a `;` en el `csv.reader` y actualizado el docstring con instrucción de entrecomillado para campos que contengan `;`.

```python
# Antes
for i, row in enumerate(csv.reader(io.StringIO(data))):

# Después
for i, row in enumerate(csv.reader(io.StringIO(data), delimiter=";")):
```

### Fix: JSON inválido silencioso en generate_json

Si el modelo pasaba JSON malformado, se descargaba el string crudo sin ningún aviso al usuario.

```python
# Antes
except json.JSONDecodeError:
    formatted = data

# Después
except json.JSONDecodeError as e:
    formatted = f"// JSON inválido: {e}\n{data}"
```

---

## Generación de Documentos (Open WebUI) — Limpieza de código y ajustes de diseño

### Renombrado a `generacion_documentos.py`

El archivo `document_generator.py` se renombró a `generacion_documentos.py` para mantener coherencia con el idioma español del proyecto.

### Limpieza de comentarios y estilo

- Eliminados docstrings innecesarios en funciones privadas `_add_inline_runs` y `_add_paragraph_with_inline`
- Comentarios inline convertidos a español y minúsculas
- Comentarios de "qué hace" eliminados; conservados solo los de "por qué" (separador de tabla, escape XSS, delimiter Excel)
- Version actualizada a `0.9.0`

### Tarjeta de descarga: nuevo orden y diseño compacto

- Orden de elementos cambiado: icono → botón Descargar → nombre del archivo
- `width: fit-content` en `.card` para que la tarjeta se ajuste al contenido sin espacio blanco sobrante
- Texto "Listo para descargar" eliminado del meta (redundante con el botón)
- Comentario HTML añadido: `<!-- tarjeta de descarga renderizada como iframe en el chat de open webui -->`

---

## Calculadora (Open WebUI) — Nueva tool

### Nuevo archivo `calculadora.py`

Tool nueva para Open WebUI con 4 funciones:

- **`calculate(expression)`** — evalúa expresiones aritméticas con whitelist regex. Acepta funciones `math.*`. Namespace sin builtins para evitar ejecución arbitraria.
- **`convert(value, from_unit, to_unit)`** — 10 conversiones bidireccionales: NM/km, nudos/km·h, ft/m, gal/L, kg/lb. Acepta nombres en español e inglés via tabla de alias.
- **`vat(amount, rate, direction)`** — desglose IVA completo (base, IVA, total). `direction="add"` añade IVA, `direction="remove"` lo extrae. Usa `Decimal` para precisión financiera.
- **`margin(cost, price, margin_pct)`** — dado coste+precio: calcula margen y markup. Dado coste+margen%: calcula PVP necesario.

Formato de salida español: punto de miles, coma decimal (`1.234,56 €`).

---

## Contexto técnico para agentes

**Archivos modificados:**
- `.docker/.bots/telegram/asistente_nautico.py` — race condition, fallback Markdown, ejemplos filenames
- `.docker/openweb/tools/generacion_documentos.py` — (antes `document_generator.py`) negrita/cursiva inline, tablas Markdown, 5 bug fixes, limpieza de código, diseño tarjeta compacto
- `.webapps/dev/tsamaps/app.js` — declinación magnética en regla náutica
- `C:\Users\luisc\OneDrive - TOURON, S.A\IT - Documentos\PROYECTOS\SISTEMAS\Plataforma LLM & RAG\00_memoria.html`

**Archivos nuevos:**
- `.backlog/tsamaps_navegacion_destino.txt`
- `.docker/openweb/tools/calculadora.py`

**Por qué `list = [0]` para el contador de sesión:**
Python no permite reasignar variables del scope externo desde una función anidada sin `nonlocal`. Al usar `list = [0]`, la variable es un objeto mutable — la función anidada modifica `counter[0] += 1` sin necesidad de `nonlocal`. Es un patrón legítimo cuando se quiere evitar declarar `nonlocal` explícitamente o cuando la función anidada es una lambda.

**Por qué la declinación se cachea por sesión de regla y no por coordenada:**
La declinación magnética varía muy poco en distancias de maniobra (decenas de NM). Una llamada al activar la regla (posición central del mapa) es suficientemente precisa. Hacer una llamada NOAA en cada mousemove sería 60 peticiones/segundo — inaceptable.

**NOAA geomag-web:** servicio público de NOAA para campo magnético terrestre (modelo WMM). Sin autenticación. El parámetro `model=WMM` usa el World Magnetic Model — precisión suficiente para navegación costera. La API devuelve también `declinationError` (incertidumbre en grados) — actualmente no se muestra al usuario.

**Tabla Markdown en DOCX — edge case conocido:**
Si una celda contiene `|` escapado (`\|`), el split por `|` lo partirá incorrectamente. No se ha implementado escape handling — poco relevante para el uso actual (el modelo no genera `\|` en tablas).

**Seguridad en `calculate()` de calculadora.py:**
Usa whitelist regex antes de `eval`: solo dígitos, operadores y nombres de funciones `math.*`. El namespace de eval es `{"__builtins__": {}, "math": math}` — sin acceso a builtins, imports ni variables externas. Una expresión maliciosa como `__import__('os').system('dir')` falla en la validación regex antes de llegar al eval.

**Docstrings de calculadora.py en inglés:**
Los docstrings de los métodos de `Tools` están en inglés intencionalmente. Open WebUI los usa para que el modelo decida qué función invocar y con qué parámetros — en inglés funcionan mejor con todos los modelos (Ollama local incluido). Los comentarios inline del código están en español.
