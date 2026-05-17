# Changelog — 2026-05-17

## shimmercloud — Inicio del proyecto de migración a Azure

### Contexto

Gerencia de Touron S.A. aprobó formalmente la migración de Shimmer a Azure cloud. Se crea la carpeta `.shimmercloud/` como base documental del nuevo entorno y se inicia la planificación.

### Decisiones confirmadas en esta sesión

- Plataforma cloud: tenant Azure corporativo de Touron S.A.
- Inferencia LLM: Azure OpenAI API — Ollama desaparece completamente
- SO: Linux
- Embeddings manuales públicos: `text-embedding-3-large` (Azure OpenAI)
- Embeddings docs internos: `bge-m3`
- Dos entornos separados en la misma VM: producción y desarrollo, contenedores y volúmenes independientes
- VM candidata: D4as v5 (4 vCPU, 16 GB RAM, AMD EPYC) — no confirmada aún
- Acceso operativo: VS Code Remote - SSH → Claude Code en la VM (autenticación con cuenta claude.ai, suscripción Pro)
- Fecha objetivo producción: noviembre 2026

### Archivos creados

- `.shimmercloud/CLAUDE.md` — punto de entrada del proyecto cloud: decisiones confirmadas, pendientes, entornos, requisitos de acceso para Claude Code, convenciones
- `.shimmercloud/migracion/plan.md` — plan de migración en 5 fases con checklist completo (Fase 0: prerequisitos Azure → Fase 5: RAG SharePoint)
- `.shimmercloud/arquitectura/decisiones.md` — registro de ADRs (ADR-001 a ADR-004 confirmados, ADR-005 a ADR-009 pendientes)

---

## backlog — Nuevo documento de backlog consolidado

Creado `.backlog/shimmer_backlog_mayo2026.md` con el estado completo del backlog a mayo 2026: pendientes (rag_sharepoint, diagnosis_motores, taller_servicio, base_datos, rag_obsidian, add_in_office, docx_open_terminal), implementados, prioridades y notas técnicas Azure.

Creados también `.backlog/taller_servicio.txt` y `.backlog/docx_open_terminal.txt` como entradas individuales nuevas.

---

## openweb — query_knowledge.py: suavizado del footer de citas

Cambiado el texto del footer que se añade al resultado de la tool:

- Antes: `"AL FINAL DE TU RESPUESTA CITA OBLIGATORIAMENTE:"`
- Ahora: `"Fuentes consultadas (incluir al final de la respuesta):"`

El tono imperativo en mayúsculas generaba respuestas más rígidas. El nuevo texto es una instrucción suave que el modelo interpreta igual de bien.

---

## Contexto técnico para agentes

**Archivos nuevos en `.shimmercloud/`:**
- `.shimmercloud/CLAUDE.md` — leer siempre al inicio de cualquier sesión sobre la migración
- `.shimmercloud/migracion/plan.md` — checklist de las 5 fases; actualizar conforme se completen tareas
- `.shimmercloud/arquitectura/decisiones.md` — añadir aquí cada nueva decisión técnica antes de implementarla

**Ollama en el nuevo entorno:** no existe. Cualquier referencia a `host.docker.internal:11434`, `OLLAMA_BASE_URL` o modelos Ollama es legacy del entorno local y no debe trasladarse al cloud.

**query_knowledge.py — footer:**
- Archivo: `.docker/openweb/tools/query_knowledge.py`, línea ~135
- El footer es una instrucción al LLM para que cite fuentes. El cambio es estético — no afecta al comportamiento del RAG ni a los resultados devueltos.
