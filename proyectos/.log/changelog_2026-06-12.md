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

## Contexto técnico para agentes

**Archivos modificados en esta sesión:**
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
