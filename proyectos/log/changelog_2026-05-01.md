# Changelog — 2026-05-01

## Open WebUI — Tuning RAG con bge-m3

### Configuración RAG optimizada para manuales técnicos

Sesión completa de tuning del pipeline RAG de Open WebUI (v0.9.2) con bge-m3 vía Ollama.
Documento de referencia usado: **Verado V12 ES.pdf** (manual Mercury Marine, 122 páginas, español técnico).

**Configuración final recomendada y aplicada:**

| Parámetro | Antes | Después |
|---|---|---|
| Chunk Size | 512 | 384 |
| Overlap | 100 | 80 |
| PDF Loader | Page | Single (revertir si scores bajos — ver nota abajo) |
| Reranking Model | (vacío) | `BAAI/bge-reranker-v2-m3` |
| Relevance Threshold | 0.3 | 0.45 |
| Top K | 10 | 10 (bajar a 6 cuando reranker esté estable) |
| Hybrid Search | ON | ON (mantener) |
| BM25 | 0.5 | 0.5 (mantener) |

**Nota crítica sobre PDF Loader Page vs Single:**
Durante la sesión se observó que con modo **Single** los scores del Verado V12 bajaron de 0.97 a 0.62. Con modo **Page** los scores eran consistentemente 0.95-0.98. Para PDFs técnicos grandes, Page funciona mejor con bge-m3. Single puede ser mejor para documentos con contenido que cruza páginas (narrativa). Los CSVs (V8 WR.csv, V8 OK.csv) funcionan bien con Single.

### Reindexado completo de la Knowledge Base

- Error al reindexar con "Reindex Knowledge Base Vectors": `Ollama embed error (500): failed to encode response: json: unsupported value: NaN`
- Causa: el reindexado reutiliza texto cacheado de la indexación anterior que puede tener caracteres corruptos
- Solución: Reset Vector Storage + Reset Upload Directory + resubir PDFs desde archivos originales
- Al subir de nuevo: 716 chunks para Verado V12, usando Markdown Header Splitter automáticamente

### Documentos indexados en la Knowledge Base

| Documento | Chunks | Formato |
|---|---|---|
| Verado V12 ES.pdf | 716 | PDF manual técnico Mercury |
| V8 WR.csv | ~300 | CSV telemetría/datos |
| V8 OK.csv | ~558 | CSV telemetría/datos |
| (2 más) | ~1869 / ~617 | PDF |

### Problema de citas con file_id en lugar de nombre

El modelo muestra `[60fa3a89-0748-4ac4-b4fa-a3923dd252b1]` en lugar de `[Verado V12 ES.pdf]`.
Causa probable: cambio de PDF Loader Page → Single elimina metadato de página, Open WebUI cae back al file_id.
Solución pendiente: añadir instrucción en system prompt del modelo para usar el campo `name` o `source` al citar.

---

## Open WebUI — Gestión de uploads y limpieza

### Problema identificado: archivos huérfanos

Open WebUI no limpia automáticamente `/app/backend/data/uploads/` cuando se borran chats o archivos de Knowledge Base. Bug conocido (issue #8888). En producción con múltiples usuarios esto crece indefinidamente.

**Incidente de la sesión:** reset manual del vector store desde Docker rompió ChromaDB (`no such table: collections`). Causa: se borró `chroma.sqlite3`. Solución: `docker restart open-webui` para que ChromaDB recree la base de datos.

**Regla operativa crítica — nunca borrar manualmente:**
- `/data/uploads/` — solo desde UI (File Manager) o scripts
- `/data/vector_db/` — solo Reset Vector Storage desde Admin Panel
- `webui.db` — nunca tocar directamente

### Backlog añadido

Creado `.backlog/openweb_limpieza_uploads.md` con:
- Descripción del problema
- Regla operativa
- Scripts de la comunidad: https://github.com/m8dhouse/openwebui-scripts
  - `cleanup_orphaned_files.py` — borra archivos en uploads sin referencia en BD
  - `cleanup_old_chats.py` — borra chats antiguos y sus archivos
- Todos los issues y discusiones relevantes de GitHub
- Alternativa S3 para producción escalable

---

## Open WebUI — Integración OneDrive/Google Drive

### Intento de integración OneDrive (no completado)

Se intentó configurar OneDrive en Open WebUI Settings → Documents → OneDrive.
Requiere registrar app OAuth en Azure AD. Bloqueado por:
- Cuenta personal Microsoft (Hotmail) no tiene acceso al Azure Portal corporativo
- Microsoft 365 Developer Program no concedió sandbox (cuenta sin actividad de desarrollo asociada)
- Azure AD de Touron como alternativa — pendiente

Google Drive como alternativa: requiere Google Cloud Console → OAuth 2.0 Client ID → activar Google Drive API. Más simple para cuenta personal. **No completado en esta sesión.**

---

## Contexto técnico para agentes

**Archivo nuevo (git):**
- `.backlog/openweb_limpieza_uploads.md` — backlog limpieza uploads Open WebUI con scripts y URLs

**Estado RAG Open WebUI a 2026-05-01:**
- Embedding: `bge-m3` vía Ollama, Batch Size 8, Async ON
- Reranker: `BAAI/bge-reranker-v2-m3` (SentenceTransformers, se descarga de HuggingFace ~570MB)
- Hybrid Search: ON, BM25 0.5, Enrich ON
- PDF Loader: Single (ojo — puede revertir a Page si scores bajos en PDFs técnicos)
- Knowledge Base activa: Verado V12 + 4 documentos más (2 CSVs V8, 2 PDFs)

**Diagnóstico RAG vía logs Docker:**
```bash
docker logs --tail 50 <container_id>
# Buscar líneas: query_doc_with_hybrid_search:result
# [[]] [[]] = colección vacía (documento sin chunks o huérfano)
# scores < 0.5 = chunking inadecuado para el documento
# scores > 0.9 = recuperación excelente
```

**ChromaDB roto — síntoma y solución:**
```
Error: chromadb.errors.InternalError: no such table: collections
Causa: chroma.sqlite3 borrado manualmente del volumen
Solución: docker restart open-webui (recrea la BD vacía) + reindexar todo
```

**Scripts de limpieza de la comunidad:**
```
https://github.com/m8dhouse/openwebui-scripts
- cleanup_orphaned_files.py --dry-run  # previsualizar
- cleanup_old_chats.py --dry-run       # previsualizar
```
