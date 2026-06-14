# Changelog — 2026-06-10

## openweb / tools — Tres tools nuevas orientadas a agentes IA

Sesión dedicada a crear versiones mejoradas de tres tools existentes de Open WebUI, pensadas para ser usadas por agentes (parámetros de selección/paginación, errores accionables en JSON, sin alucinación de cifras). Las originales (`read_file.py`, `calculadora.py`, `generate_doc.py`) quedan intactas.

### read_any_file.py (v1.0.0) — copia mejorada de read_file.py

Lector universal de adjuntos del chat:

- **Formatos nuevos**: PowerPoint `.pptx` (textos, tablas y notas por diapositiva), JSON (parseado + resumen de estructura), HTML (texto sin tags), XML, ~30 extensiones de texto/código (`.py`, `.sql`, `.yaml`, `.log`, `.ps1`...)
- **Fallback**: extensión desconocida → detección binario/texto; si es texto se lee igualmente
- **Multi-adjunto**: parámetro `file_name` (match exacto o parcial); la respuesta incluye `otros_adjuntos`
- **Paginación**: `offset`/`max_rows` (tope 500) en Excel/CSV; `page_start`/`page_end` en PDF (tope 50 págs/llamada)
- Campo `truncated` en todas las respuestas; aviso si el PDF es escaneado (sin texto, no hace OCR)
- `.doc`/`.xls` antiguos → error con instrucción de convertir a formato moderno
- Mantiene la instrucción anti-prompt-injection de la original
- Requirements: `openpyxl, python-docx, pypdf, python-pptx`

### calculadora_avanzada.py (v1.0.0) — nueva, junto a calculadora.py

9 funciones, solo stdlib + pydantic:

- `calculate` — evaluador **AST seguro** (sustituye al `eval`+regex de la original): trigonometría, logaritmos, factorial, combinatoria, listas, `mean`/`stdev`, constantes `pi`/`e`. Bloquea `__import__`, acceso a atributos y exponentes > 10000
- `statistics` — resumen completo: media, mediana, moda, desviación, varianza, P25/P75, coef. variación
- `convert` — conversor por dimensiones (no por pares): longitud, velocidad, masa, volumen, área, presión, potencia (HP/CV/kW), energía, temperatura, tiempo, datos. Alias español/inglés
- `percentage` — 5 modos (of, is, change, increase, decrease)
- `vat` y `margin` — heredados de la original sin cambios funcionales
- `loan` — cuota préstamo sistema francés; `compound_interest` — con aportaciones mensuales
- `date_calc` — diff/add/subtract/weekday; acepta `hoy`, `DD/MM/YYYY`, `YYYY-MM-DD`
- Salida en formato español (1.234,56). Probada incluyendo casos de seguridad

### generate_any_doc.py (v1.0.0) — copia mejorada de generate_doc.py

Generador universal de documentos descargables (mantiene la tarjeta iframe con botón de descarga):

- **Funciones nuevas**: `generate_pdf` (Markdown → PDF con fpdf2: títulos, listas, tablas, `[PAGEBREAK]`), `generate_pptx` (cada `# Título` = diapositiva, sangría = sub-viñeta, portada con `## subtítulo`), `generate_html` (envuelve body en plantilla si falta `<html>`), `generate_text_file` (cualquier extensión de texto/código)
- `generate_docx` mejorado: h4, `código` inline, bloques ``` en Courier 9pt, sub-viñetas, `[PAGEBREAK]`
- `generate_excel` mejorado: **multi-hoja vía JSON** (`{"Hoja": [filas]}`, filas como listas u objetos), cabecera negrita, freeze panes, autofiltro, ancho de columna automático; sigue aceptando CSV con `;`
- `generate_csv` con BOM UTF-8 (acentos correctos en Excel)
- Saneado de nombre de archivo (caracteres ilegales Windows) en todas las funciones
- Requirements: `python-docx, openpyxl, python-pptx, fpdf2`

Todas probadas en local (host con fastapi, python-docx, openpyxl, python-pptx y fpdf2 instalados vía pip durante la sesión). Pendiente: crearlas en Open WebUI (Workspace → Tools) pegando el contenido.

---

## Contexto técnico para agentes

**Archivos nuevos** (las originales no se tocaron):
- `.docker/openweb/tools/read_any_file.py`
- `.docker/openweb/tools/calculadora_avanzada.py`
- `.docker/openweb/tools/generate_any_doc.py`

**fpdf2 — `multi_cell` (crítico):** en fpdf2 moderno, `multi_cell` deja el cursor X al final de la celda (default `new_x=RIGHT`). Todas las llamadas en `generate_any_doc.py` llevan `new_x=XPos.LMARGIN, new_y=YPos.NEXT`; si se quitan, la segunda llamada lanza `FPDFException: Not enough horizontal space to render a single character`.

**PDF y latin-1:** las fuentes core de fpdf2 solo soportan latin-1. `_pdf_safe()` sustituye caracteres problemáticos (`€`→EUR, comillas tipográficas, flechas...) antes de renderizar. No eliminar este paso o el PDF falla con caracteres fuera de latin-1.

**Evaluador AST (`calculadora_avanzada.py`):** `_safe_eval()` valida el árbol con whitelist de nodos (`_ALLOWED_NODES`), funciones (`_ALLOWED_FUNCS`) y constantes. El límite de exponente (10000) evita DoS por `9**999999`. No reemplazar por `eval` directo.

**CSV BOM:** `generate_csv` antepone `﻿` para que Excel detecte UTF-8. El escape está explícito en el código (no como carácter invisible).

**`read_any_file.py` — resolución de adjuntos:** `_resolve_attachments()` busca en `UPLOAD_DIR` (default `/app/backend/data/uploads`) por prefijo de `file id`, con fallback por nombre. Soporta el formato anidado `{"file": {"id": ..., "filename": ...}}` además del plano.

**`__pycache__`:** quedó `.docker/openweb/tools/__pycache__/` sin trackear por las pruebas locales — no commitear (valorar añadir `__pycache__/` a `.gitignore`).

---

## openweb / tools — Reorganización en stable/ y experimental/

Sesión dedicada a reorganizar la carpeta `.docker/openweb/tools/` para diferenciar las tools en producción de las que están en desarrollo.

### Estructura nueva

```
tools/
├── stable/               # Tools en producción (sin cambios)
│   ├── read_file.py
│   ├── read_g3.py
│   ├── calculadora.py
│   ├── generate_doc.py
│   └── query_knowledge.py
└── experimental/         # Tools en desarrollo
    ├── dev_read_file.py       (antes: read_any_file.py)
    ├── dev_calculadora.py     (antes: calculadora_avanzada.py)
    └── dev_generate_doc.py    (antes: generate_any_doc.py)
```

### Cambios realizados

- Creadas subcarpetas `stable/` y `experimental/` dentro de `.docker/openweb/tools/`
- Las cinco tools originales (en producción) movidas a `stable/` sin modificar
- Las tres tools nuevas de la sesión anterior movidas a `experimental/` y renombradas con prefijo `dev_` y sin `_any` en el nombre
- Eliminado `__pycache__/` con los dos `.pyc` generados durante las pruebas locales

## Contexto técnico para agentes

**Rutas actuales de tools:**
- Producción: `.docker/openweb/tools/stable/`
- Desarrollo: `.docker/openweb/tools/experimental/`

**Correspondencia de nombres (experimental):**

| Nombre nuevo | Nombre anterior | Descripción |
|---|---|---|
| `dev_read_file.py` | `read_any_file.py` | Lector universal de adjuntos (v1.0.0) |
| `dev_calculadora.py` | `calculadora_avanzada.py` | Calculadora con evaluador AST seguro (v1.0.0) |
| `dev_generate_doc.py` | `generate_any_doc.py` | Generador universal de documentos (v1.0.0) |

Los archivos en `stable/` no se modificaron — mismo contenido, solo nueva ubicación.
