# Changelog — 2026-05-08

## Infraestructura — Migración ngrok → Tailscale

### Eliminación de referencias a ngrok

ngrok jubilado y reemplazado por Tailscale. Se han limpiado todas las referencias en scripts, documentación y memoria del agente.

**Archivos modificados:**
- `.claude/commands/tsamaps-dev.md` — eliminada mención al túnel ngrok
- `.claude/commands/tsamaps-prod.md` — eliminada mención al túnel ngrok
- `.claude/ops/tsamaps-dev-start.ps1` — eliminadas líneas `Stop-Process ngrok` y `Start-Process ngrok.exe`
- `.claude/ops/tsamaps-dev-stop.ps1` — eliminada línea `Stop-Process ngrok`
- `.claude/ops/tsamaps-prod-start.ps1` — eliminadas líneas `Stop-Process ngrok` y `Start-Process ngrok.exe`
- `.claude/ops/tsamaps-prod-stop.ps1` — eliminada línea `Stop-Process ngrok`
- `.webapps/dev/tsamaps/Runtime.md` — eliminadas referencias al túnel en funciones y comportamiento esperado
- `.webapps/dev/tsamaps/runtime/start.ps1` — eliminadas 3 líneas de ngrok
- `.webapps/dev/tsamaps/runtime/stop.ps1` — eliminadas 2 líneas de ngrok
- `.webapps/dev/tsamaps/runtime/stop.sh` — eliminado bloque ngrok
- `.webapps/prod/tsamaps/Runtime.md` — ídem dev
- `.webapps/prod/tsamaps/runtime/start.ps1` — eliminadas 3 líneas de ngrok
- `.webapps/prod/tsamaps/runtime/stop.ps1` — eliminadas 2 líneas de ngrok
- `.webapps/prod/tsamaps/runtime/stop.sh` — eliminado bloque ngrok
- `CLAUDE.md` — sección `.tunnel/` actualizada, eliminada subcarpeta `ngrok/`
- Memoria `feedback_runtime_tsamaps.md` — eliminadas referencias, añadido "Tailscale gestiona el túnel externamente"

**Nota:** `openweb.bat` conservado sin modificar (legacy).

---

## Open WebUI — query_knowledge.py: scores en citas

### Mejora: scores de relevancia en el footer de citas

`query_knowledge.py` actualizado para extraer los scores de ChromaDB (`distances`) y mostrarlos junto a cada fuente citada.

**Cambio:** el footer de citas ahora incluye el score por cada página:
```
📄 Verado V12 ES.pdf (p. 42) [score: 0.847]
```

**Decisiones de diseño:**
- Los scores se extraen de `query_results.get("distances", [[]])[0]` — clave estándar de ChromaDB
- Se asocian por índice al chunk correspondiente durante el bucle de deduplicación
- El formato es `:.3f` (3 decimales)
- Solo aparece si el score no es `None` (fallback seguro si ChromaDB no devuelve distances)
- Los scores confirman ser de similitud coseno — valores altos (~0.8-0.9) indican alta relevancia

**Otros cambios en query_knowledge.py:**
- `author` cambiado de `shimmer` a `Luis Conde`
- `version` cambiada de `9.0.0` a `0.9.0`
- Tildes y caracteres especiales eliminados del docstring y header (causaban error de parsing en Open WebUI al instalar)

---

## Open WebUI — Nueva tool web_search.py

### Nueva herramienta de búsqueda web custom

Creada `.docker/openweb/tools/web_search.py` como alternativa a la herramienta integrada de búsqueda web de Open WebUI, que presentaba bugs de estado en plantillas de agentes.

**Motivación:** la herramienta integrada de búsqueda web dejó de funcionar en el agente tras desactivar y reactivar las herramientas integradas — bug conocido en Open WebUI (Discussion #6079, Issue #21120). Crear el agente desde cero lo resolvía, pero la tool custom elimina la dependencia del sistema de herramientas integradas.

**Características:**
- 2 queries secuenciales (ES + EN) para maximizar cobertura
- Backend Google via `duckduckgo-search` (`backend="google"`)
- COUNT = 10 resultados por query, deduplicados por URL
- Footer de citas con URLs en formato markdown: `🌐 [Título](url)`
- Instrucción embebida en el output: `AL FINAL DE TU RESPUESTA CITA OBLIGATORIAMENTE LAS FUENTES USADAS`
- Mismo patrón de citación que `query_knowledge.py` — 🌐 para web, 📄 para docs internas

**Requirement:** `duckduckgo-search` (instalado automáticamente por Open WebUI al guardar la tool).

---

## Documentos — Edición presentación.html y 00_memoria.html

### 00_memoria.html

Archivo: `C:\Users\luisc\OneDrive - TOURON, S.A\IT - Documentos\PROYECTOS\SISTEMAS\Plataforma LLM & RAG\00_memoria.html`

**Cambios:**
- Eliminado bullet "Escalado externo" de la sección de compromisos
- "me comprometo a documentar el proyecto" → "El proyecto será documentado"
- Título de sección "Compromisos y Ruegos" → "Compromisos"
- Añadido enlace al paper NBER en el bullet "Impacto real"

### presentación.html

Archivo: `C:\Users\luisc\OneDrive - TOURON, S.A\IT - Documentos\PROYECTOS\SISTEMAS\Plataforma LLM & RAG\presentación.html`

**Cambios en Estrategia de Implementación:**
- Eliminadas etiquetas de tiempo de todas las fases (2 meses, 4 meses, 6 meses, Continuo, 9 meses)
- Eliminada Fase 5 (Portal Cliente) completa
- Eliminada sección "Nota Personal — Soberanía Tecnológica" completa
- Fase 2 → "Negocio" (Comercial y Marketing)
- Fase 3 → "Finanzas y Contabilidad" (integración ERP Libra)
- Fase 4 → "Sistemas"

**Cambios en Análisis Económico:**
- Tarjeta "Comparativa de Despliegue" movida a después de la tabla de precios API de OpenAI
- Nuevo layout horizontal: Hardware Local + Azure (fila superior, 2 columnas) / AWS (fila inferior, centrado, w-1/2)
- Fondo cambiado de `bg-white border` a `bg-touron-blue` para visibilidad sobre fondo oscuro
- Títulos cambiados a `text-white` y `text-blue-200`
- Eliminada fila "Control" de las 3 tarjetas de comparativa
- Hardware Local — escalabilidad: Baja (15%) → Media (50%)

---

## Backlog — Ideas de tools para Open WebUI

Creado `.backlog/ideas_tools_openweb.txt` con herramientas pendientes de implementar y ya cubiertas.

**Pendientes:**
- `fetch_url` — descarga HTML o PDF de una URL y devuelve texto limpio al agente (httpx + BeautifulSoup + pypdf)
- `code_run` — ejecuta código Python en sandbox y devuelve stdout/stderr al chat (equivalente al intérprete de ChatGPT)
- `erp_query` — consultas al ERP Libra (Oracle) desde el chat (pendiente diseño y conector)

---

## Corrección changelog 2026-05-07

Corregido el modo FC del agente náutico, que estaba documentado incorrectamente como "Default":

- **Modo FC real:** Native (no Default)
- **Herramientas integradas:** todas desactivadas en parámetros avanzados de la plantilla
- **Efecto:** `view_knowledge_file` no aparece en el espacio de herramientas aunque el modo sea Native
- `query_knowledge` es la única tool disponible en el agente

---

## Contexto técnico para agentes

**Archivos nuevos:**
- `.docker/openweb/tools/web_search.py` — tool búsqueda web custom (pendiente de registrar en Open WebUI)
- `.backlog/ideas_tools_openweb.txt` — ideas de tools pendientes y ya cubiertas

**Archivos modificados:**
- `.docker/openweb/tools/query_knowledge.py` — scores añadidos, author/version corregidos, tildes eliminadas del docstring
- `C:\Users\luisc\OneDrive - TOURON, S.A\IT - Documentos\PROYECTOS\SISTEMAS\Plataforma LLM & RAG\00_memoria.html` — fuera del repo git
- `C:\Users\luisc\OneDrive - TOURON, S.A\IT - Documentos\PROYECTOS\SISTEMAS\Plataforma LLM & RAG\presentación.html` — fuera del repo git

**Estado del agente náutico `asistente-touron` (Open WebUI — no versionado en git):**
- Modo FC: **Native**
- Herramientas integradas: **todas desactivadas**
- Tools activas: solo `query_knowledge`
- `web_search` pendiente de registrar y activar en el agente

**Por qué las tildes en el docstring de una tool rompen la instalación en Open WebUI:**
Open WebUI parsea el bloque `"""..."""` del header y el docstring de cada función para extraer metadatos y exponerlos al modelo. Si hay caracteres especiales (tildes, eñes, guiones em) en esas zonas, el parser de Open WebUI falla con `unterminated triple-quoted string literal`. El cuerpo del `.py` (strings de retorno, f-strings, logs) no pasa por ese parser y admite cualquier carácter.

**Por qué `backend="google"` en DDGS:**
DuckDuckGo directo tiene rate limiting agresivo e intermitente. El backend Google de la librería `duckduckgo-search` es más estable. Mismo motivo que `DDGS_BACKEND=google` en `prod.yml`.

**Por qué las queries son secuenciales y no paralelas en ambas tools:**
`embedding_function` (query_knowledge) y DDGS (web_search) no soportan llamadas concurrentes desde la misma instancia. Con `asyncio.gather` una de las dos queries siempre falla o devuelve vacío.
