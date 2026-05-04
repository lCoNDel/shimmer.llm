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

**Por qué el modelo `asistente-touron` no tiene KB asignada:**
Es intencionado. El bot fuerza el uso de `query_knowledge_files` como tool call explícita en lugar del RAG nativo de Open WebUI. El fallback a `/api/v1/knowledge/` lista todas las KBs disponibles en la instancia y usa esas colecciones. `KB collections del modelo: []` en los logs es normal, no un error.

**Por qué `k: 15` y no más:**
El reranker de Open WebUI está configurado para devolver máximo 15 chunks. Pedir más de 15 no añade chunks — devuelve los mismos 15. Si se cambia el reranker top-k en Open WebUI, actualizar este valor en consecuencia.

**Flujo de colecciones en cada tool call:**
1. `get_model_kb_collections()` → consulta `/api/v1/models/model?id=asistente-touron` → devuelve `[]`
2. Fallback → consulta `/api/v1/knowledge/` → obtiene lista de KBs (`245f2ffa`, `ea80e4f0`, ...)
3. Búsqueda sobre esas colecciones con `k: 15, hybrid: True`
