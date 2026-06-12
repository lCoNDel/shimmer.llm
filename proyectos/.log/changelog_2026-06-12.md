# Changelog — 2026-06-12

## openweb — Actualización de Open WebUI Dev a v0.9.6

### Motivación

Open WebUI v0.9.6 corrige el bug que rompía `/api/chat/completions` para clientes externos sin `chat_id` (HTTP 400, `'NoneType' object has no attribute 'startswith'` — issues #24550/#24553/#25235, el que el 13 de mayo obligó al workaround `"chat_id": "local:..."` y a devolver el bot de Telegram a prod v0.9.4). Se actualiza **solo dev** para validar antes de subir prod.

### Proceso de actualización

1. Backup del volumen `open-webui` (compartido prod/dev) antes de actualizar:
   - Archivo: `.docker/backup/open-webui-backup-20260612.tar.gz` (2,1 GB, fuera de git)
   - Comando: `docker run --rm -v open-webui:/data -v "C:\...\backup:/backup" alpine tar czf /backup/open-webui-backup-20260612.tar.gz /data`
   - **Criterio nuevo del usuario**: backups solo para prod — este se hizo porque el volumen es compartido y las migraciones de dev tocan los datos de prod; en dev puro no se hace backup
2. `open-webui` (prod, 3000) parado — obligatorio por el volumen compartido
3. Tag actualizado en `dev.yml`: `v0.9.5` → `v0.9.6`
4. Pull de imagen y `docker compose up -d --force-recreate open-webui-dev`
5. Migraciones alembic ejecutadas sin errores: `add knowledge_directory table`, `add missing primary keys to legacy peewee tables`
6. Parche rebrand `env.py` reaplicado (ver abajo) y contenedor reiniciado

No apareció el fallo de arranque por `RAG_EMBEDDING_ENGINE` reportado en el issue #25634 al venir de versiones anteriores.

### Parche rebrand env.py — cambio a sed por patrón

El comando documentado en CLAUDE.md borraba las líneas 131-132 de `env.py`, pero en v0.9.6 el bloque del sufijo `(Open WebUI)` se movió a las líneas 772-773. El comando pasa a borrar por patrón (independiente de versión):

```bash
docker exec open-webui-dev sh -c "sed -i '/^if WEBUI_NAME/,+1d' /app/backend/open_webui/env.py" && docker restart open-webui-dev
```

Verificado contra la imagen v0.9.6 limpia en contenedor temporal: el patrón coincide exactamente una vez y tras aplicarlo queda solo `WEBUI_NAME = os.getenv('WEBUI_NAME', 'Open WebUI')`.

### Documentación — workflow como fuente única

Criterio del usuario: sin redundancia entre documentos; los procedimientos viven solo en su workflow y él indicará explícitamente cuál usar.

- **`.docker/openweb/workflows/update_workflow.md`**:
  - Cabecera: los pasos sirven para prod y dev (sustituir `prod.yml`/`open-webui`/3000 por `dev.yml`/`open-webui-dev`/3002); restricción de volumen compartido referida a CLAUDE.md
  - **Paso 7 nuevo — Reaplicar parche rebrand**: comando sed por patrón con verificación previa (`grep -c '^if WEBUI_NAME'`; si devuelve 0, no ejecutar a ciegas y localizar el bloque)
  - Pasos renumerados: verificar logs (8, ahora incluye migraciones alembic), verificar UI (9, ahora incluye "Touron LLM" sin sufijo), reportar (10)
- **`CLAUDE.md`**: la línea del parche en "Rebrand Open WebUI Dev" ya no lleva el comando con números de línea obsoletos; solo el hecho + puntero al paso 7 del workflow

---

## docs — STATUS.md como puente de contexto con claude.ai móvil

### Qué se hizo

- **Nuevo `STATUS.md` en la raíz del repositorio** (junto a README.md, fuera de `proyectos/`). Documento autocontenido de ~215 líneas con el estado completo de Shimmer: snapshot operativo, arquitectura, estructura del repo, estado de componentes, decisiones técnicas (ADRs), backlog priorizado, plan de migración Azure y configuración RAG/embeddings/modelos.
- **Propósito**: se sube a un Project de claude.ai y es la **única** fuente de contexto que Claude tiene en el móvil sobre el estado real de Shimmer. Por eso: autocontenido, máximo ~300 líneas, sin tokens ni API keys (los bots las llevan en claro en sus .py — excluidas deliberadamente).
- Generado tras exploración completa del repo (CLAUDE.md, compose, `.backlog/`, `.shimmercloud/`, bots, changelogs). Hallazgos reflejados: `asistente_servicio.py` es solo esqueleto (sin token ni modelo); `web_search.py` citada en `.shimmercloud/CLAUDE.md` pero ausente del repo → marcada `[VERIFICAR]`.
- **Skill `fin-sesion` ampliada** (`.claude/commands/fin-sesion.md`): nuevo paso 5 "Sincronizar STATUS.md" (editar solo secciones afectadas, actualizar fecha de cabecera, revisar §2 snapshot / §3 arquitectura / §5 componentes / §7 backlog), paso de commit renumerado a 6, y nueva regla "STATUS.md siempre sincronizado — sin secretos".
- **README.md de la raíz actualizado**: estado actual con migración Azure aprobada (objetivo noviembre 2026) y puntero a STATUS.md; dev v0.9.5 → v0.9.6; filas Filebrowser y tools.yml en las tablas de arquitectura; asistente_servicio marcado "en desarrollo"; nueva entrada "Tools para Open WebUI" en lo construido; árbol del repo con `.shimmercloud/`, `certs/`, `tools/stable|experimental` y STATUS.md.

### Mantenimiento

- STATUS.md se actualiza al cierre de cada sesión vía `/fin-sesion`; tras el commit, resubir manualmente al Project de claude.ai (la subida no se puede automatizar desde aquí).

---

## tsamaps — proyecto a estado EOL

### Decisión

El usuario declara **tsamaps EOL** (end of life): desarrollo finalizado. El proyecto se conserva archivado como **fuente de conocimiento para futuros proyectos** (patrones Leaflet/JS vanilla, proxy FastAPI hacia Open WebUI, integración de chat IA, responsive móvil).

### Implicaciones

- Sin nuevas features ni mantenimiento. Las ideas de backlog de tsamaps (calculadora de ruta, alertas meteo, navegación a destino, tracking tiempo real, compartir posición) quedan descartadas/archivadas.
- El código y sus changelogs en `.log/` no se borran — son material de consulta.
- tsamaps queda fuera del alcance de la migración Azure.
- Reflejado en README.md (raíz), STATUS.md (§2, §3, §4, §5, §7, §8), CLAUDE.md, `.shimmercloud/` y memoria persistente del agente.

### Archivado físico y scripts de demo

- **Movido con `git mv`**: `.webapps/prod/tsamaps/` → `.webapps/antiguos/tsamaps/` (historial git conservado como renames). `.webapps/prod/` queda vacía.
- **Excepción en `.webapps/antiguos/.gitignore`** (`!tsamaps/`, `!tsamaps/**`): antiguos/ ignora todo por defecto, pero tsamaps sigue versionado — es fuente de conocimiento, no puede salir de git.
- **Requisito del usuario: la demo debe poder enseñarse.** Scripts de arranque reubicados de `tsamaps/runtime/` a `.claude/ops/`:
  - `tsamaps-demo-start.ps1` / `tsamaps-demo-stop.ps1` — cadena completa: open-webui (3000) + asistente_nautico + tsamaps_server (5050)
  - Los `tsamaps-prod-start/stop.ps1` existentes (solo tsamaps_server) siguen válidos
  - En `antiguos/tsamaps/runtime/` quedan solo legacy: `start.sh`/`stop.sh` (prohibidos en este entorno) y `tunnel.ps1` (ngrok, jubilado)
- **`proxy.yml`**: ruta del volumen actualizada a `../../.webapps/antiguos/tsamaps` + comentario EOL — el contenedor sigue siendo arrancable.
- **Skill `tsamaps-prod.md`** reescrita: aviso EOL, toggle start/stop habitual y sección "Demo completa" con los nuevos scripts.
- **CLAUDE.md**: tsamaps marcado EOL en stack y puertos (5050 = arranque puntual para demos), restricción obsoleta de puerto compartido dev/prod eliminada, sección `.webapps/` reescrita (antiguos = EOL con excepción operativa de demo), añadido `.shimmercloud/` al árbol y Estado del Proyecto actualizado (próximo paso = migración Azure).
- **`.shimmercloud/migracion/plan.md`**: tsamaps eliminado de fases 0/2/3 (NSG 5050, despliegues dev y prod) y nota explícita de exclusión; la nota de API key ya solo referencia `asistente_nautico.py`. `.shimmercloud/CLAUDE.md`: resumen del entorno actual marca tsamaps EOL.

---

## docs — README reescrito como carta de presentación + corrección de propósito

### Corrección de propósito (criterio del usuario)

El README describía Shimmer como proyecto limitado a consulta técnica/taller. **Corrección de Luis: el propósito es ofrecer agentes multimodales y versátiles a TODA la empresa — habrá agentes por departamento con funciones a la carta** (ventas, administración, marketing, SAT, IT...). Los asistentes actuales son los primeros de esa línea, no su alcance final. Guardado en memoria persistente del agente; STATUS.md §1 también corregido.

### Reescritura completa del README

README de la raíz reescrito dos veces en la sesión: primero con tono de carta de presentación y, tras feedback del usuario ("sé más técnico, no deja de ser un repositorio"), versión final en **registro técnico**:
- Intro factual: propósito (agentes por departamento), stack base y estado, con punteros a STATUS.md y `.shimmercloud/`
- **Arquitectura**: tablas de servicios y compose, patrón de conexión de los bots (long polling → `/api/chat/completions` con ciclo de tool calls client-side), restricción de volumen compartido prod/dev
- Subsección **RAG** con parámetros reales: ChromaDB, bge-m3, bge-reranker-v2-m3, híbrida + BM25, chunk 384, umbral 0.45, tool `query_knowledge` en lugar del Built-in
- **Componentes** con detalle técnico (rebrand vía bind mounts + parche env.py, pymupdf, DDGS, lista de tools con su función)
- Árbol del repo en bloque de código y **Roadmap** con referencias a los diseños en el repo
- Eliminado el tono de marketing (sección "Visión" con principios, sección "Autor")

---

## Contexto técnico para agentes

**Archivos modificados en esta sesión:**
- `STATUS.md` — NUEVO, en la raíz del repositorio (no en `proyectos/`) — puente de contexto con claude.ai móvil
- `README.md` (raíz) — sincronizado con el estado real: Azure, v0.9.6, .shimmercloud/, tools stable/experimental
- `.webapps/prod/tsamaps/` → `.webapps/antiguos/tsamaps/` — movido con git mv (EOL); `.webapps/antiguos/.gitignore` con excepción `!tsamaps/**`
- `.claude/ops/tsamaps-demo-start.ps1` y `tsamaps-demo-stop.ps1` — NUEVOS (reubicados desde `tsamaps/runtime/`): cadena completa de demo
- `.docker/compose/proxy.yml` — volumen apunta a `antiguos/tsamaps`; comentario EOL
- `.claude/commands/tsamaps-prod.md` — reescrita: aviso EOL + sección demo completa
- `CLAUDE.md` — tsamaps EOL (stack, puertos, .webapps/, compose, estado); añadido `.shimmercloud/` al árbol; próximo paso = migración Azure
- `.shimmercloud/CLAUDE.md` y `.shimmercloud/migracion/plan.md` — tsamaps excluido de la migración
- `.claude/commands/fin-sesion.md` — paso 5 nuevo (sincronizar STATUS.md), commit renumerado a paso 6, regla nueva
- `.docker/compose/dev.yml` — tag `v0.9.5` → `v0.9.6`
- `.docker/openweb/workflows/update_workflow.md` — paso 7 (parche rebrand), cabecera prod/dev, renumeración 8-10
- `CLAUDE.md` — línea del parche env.py reescrita como puntero al workflow
- `.docker/backup/open-webui-backup-20260612.tar.gz` — backup volumen (NO incluir en git — 2,1 GB)

**Estado de contenedores al cierre — IMPORTANTE:**
- `open-webui-dev`: **corriendo** con v0.9.6 en el 3002, rebrand aplicado
- `open-webui` (prod, 3000): **PARADO** — el bot de Telegram y tsamaps apuntan al 3000 y están sin servicio hasta validar dev y decidir: subir prod a v0.9.6 (seguir `update_workflow.md`) o rearrancar prod en v0.9.4
- Si se rearranca prod en v0.9.4: la base de datos ya tiene las migraciones de v0.9.6 aplicadas (volumen compartido). Si diera problemas, restaurar desde `open-webui-backup-20260612.tar.gz`

**Parche env.py — no usar números de línea:**
- v0.9.4/v0.9.5: líneas 131-132; v0.9.6: líneas 772-773 — cambian con cada versión
- Usar siempre el sed por patrón del paso 7 del workflow; si `grep -c '^if WEBUI_NAME'` devuelve 0, el parche ya está aplicado o el código ha cambiado — no borrar a ciegas

**Validación pendiente de la v0.9.6 (motivo de actualizar solo dev):**
- Probar `/api/chat/completions` sin `chat_id` (el fix anunciado en la release)
- Probar consulta RAG con varias tool calls — issue abierto #25691 reporta fallos de tool calls en v0.9.6 vía API con Ollama (workaround del reportante: volver a v0.9.4)
- El workaround `"chat_id": "local:tsamaps"` en `prod/tsamaps/server.py` es inocuo con el fix — no hace falta quitarlo

**Cambios relevantes de la v0.9.6 para el proyecto:**
- `CHAT_RESPONSE_MAX_TOOL_CALL_ITERATIONS` (antes otro nombre): tope de iteraciones de tools sube de 30 a 256 por defecto
- Carpetas anidadas en Knowledge Bases; tool calls más rápidas (fetch en batch)
- Incluye fixes de seguridad — los desarrolladores recomiendan actualizar prod pronto
