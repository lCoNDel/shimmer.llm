# Backlog — Limpieza de archivos en Open WebUI (uploads)

## Problema

Open WebUI acumula archivos basura en `/app/backend/data/uploads/` sin limpiarlos automáticamente:

- Los archivos adjuntos en chats (imágenes, PDFs sueltos en mensajes) nunca se borran aunque se elimine el chat
- Los archivos borrados desde la Knowledge Base quedan como huérfanos en uploads (bug conocido, issue #8888)
- No hay limpieza automática ni herramienta nativa en la UI para limpiar en bloque
- En producción con múltiples usuarios esto crece indefinidamente

**Contexto descubierto el 2026-05-01** durante sesión de tuning RAG: al intentar limpiar manualmente el vector store desde Docker se rompió ChromaDB (`no such table: collections`). La limpieza manual directa sobre el volumen Docker rompe la sincronía entre SQLite (metadatos), uploads (archivos físicos) y ChromaDB (vectores). Siempre operar desde la UI o con los scripts de abajo.

---

## Regla operativa hasta implementar solución

**Nunca borrar manualmente:**
- `/data/uploads/` — solo borrar desde UI (File Manager) o scripts
- `/data/vector_db/` — solo Reset Vector Storage desde Admin Panel
- `webui.db` — nunca tocar directamente

**Para limpieza completa coordinada** usar siempre: Admin Panel → Settings → Reset Upload Directory + Reset Vector Storage/Knowledge, y reindexar todo desde cero.

---

## Solución: Scripts de limpieza de la comunidad

Repositorio: **https://github.com/m8dhouse/openwebui-scripts**

### `cleanup_orphaned_files.py`
Borra archivos en `/uploads/` que no están referenciados en la base de datos (ni en chats, ni en Knowledge Base, ni en la tabla de archivos). Tiene modo **dry run** para previsualizar antes de borrar.

### `cleanup_old_chats.py`
Borra chats más antiguos de N días y sus archivos asociados. También tiene modo dry run.

**Uso recomendado para producción:**
1. Ejecutar `cleanup_orphaned_files.py --dry-run` para revisar qué se borraría
2. Si el resultado es correcto, ejecutar sin `--dry-run`
3. Programar como tarea periódica (semanal o mensual según volumen de uso)

---

## Issues y discusiones relevantes

- **Bug principal — archivos huérfanos tras borrar de KB**: https://github.com/open-webui/open-webui/issues/8888
- **Discusión sobre el mismo bug**: https://github.com/open-webui/open-webui/discussions/8902
- **Best practices y limpieza**: https://github.com/open-webui/open-webui/discussions/12091
- **Cómo limpiar archivos antiguos**: https://github.com/open-webui/open-webui/discussions/9801
- **Propuesta de housekeeping automático**: https://github.com/open-webui/open-webui/discussions/8875
- **Propuesta borrado opcional al eliminar chat**: https://github.com/open-webui/open-webui/discussions/12280
- **Botón admin para borrar archivos no usados**: https://github.com/open-webui/open-webui/discussions/13869
- **Archivos redundantes en uploads antes del check de duplicados**: https://github.com/open-webui/open-webui/issues/23227
- **Datos persistentes tras borrar KB**: https://github.com/open-webui/open-webui/discussions/14077
- **Documentación oficial File Management**: https://docs.openwebui.com/features/chat-conversations/data-controls/files/

---

## Alternativa para producción escalable

Configurar **S3 como backend de uploads** en lugar del disco local del contenedor. Open WebUI lo soporta via variables de entorno. Con S3 el almacenamiento es elástico, gestionable externamente y no afecta al contenedor. Pendiente de investigar configuración específica para la versión 0.9.x.
