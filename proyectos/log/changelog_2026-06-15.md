# Changelog — 2026-06-15

## plan — Reestructuración del embudo de planificación

### Motivación

`plan/backlog/` mezclaba ideas sueltas de dos líneas con proyectos completamente
diseñados (código, compose, ADRs). Faltaba un nivel intermedio para ideas que ya
merecen investigación seria pero sin compromiso de implementación.

### Decisión de diseño

Embudo de tres niveles inspirado en terminología Agile:

- `plan/ideas/` — bloc de notas libre, sin filtro ni compromiso
- `plan/spikes/` — en investigación activa (spike: tarea acotada para reducir
  incertidumbre antes de comprometerse)
- `plan/backlog/` — comprometido, tiene diseño, se implementará

### Cambios realizados

- Creada `plan/spikes/` con `.gitkeep`
- `CLAUDE.md` actualizado en tres puntos: árbol de estructura, sección `plan/`,
  y regla de convenciones

---

## docs — Reorganización y nuevo directorio de agentes

### Cambios realizados

- Creada `docs/templates/`: `RAG Default.txt` movido aquí (era el único archivo
  en `docs/`, sin contexto de carpeta)
- Creada `docs/agentes/`: documentación de agentes desplegados en Open WebUI
- Nuevo `docs/agentes/taller_servicio.md`: ficha del agente de soporte al taller
  de servicio técnico (ver abajo)

---

## plan/backlog — Triage parcial de archivos .txt

### Eliminados

| Archivo | Motivo |
|---|---|
| `qwen_system_prompt.txt` | Referencia técnica, no un plan. Contenido consultable en docs oficiales QwenLM. |
| `taller_servicio.txt` | Ya implementado en producción — se documenta en `docs/agentes/`. |

Triage pendiente: resto de .txt en backlog (continuará en próxima sesión).

---

## Agente en producción: Taller de Servicio Técnico

Documentado por primera vez en esta sesión. El agente estaba operativo en Open
WebUI sin registro formal en el repo.

**Características:**
- RAG sobre documentación técnica multilingüe (manuales Mercury/Brunswick en varios idiomas)
- Diseñado para todo tipo de usuarios (no solo técnicos del SAT)
- Reconvierte la solicitud del usuario antes de lanzar al RAG para mejorar precision
- Búsqueda bilingüe en paralelo: español + inglés
- Roadmap: añadir portugués (sucursal Cascais)

---

## Contexto técnico para agentes

**Nueva estructura de `plan/`:**
- `plan/ideas/` → sin compromiso; bloc de notas libre
- `plan/spikes/` → investigación activa; la idea pasó el filtro pero no hay
  compromiso de implementación
- `plan/backlog/` → comprometido y en cola; tiene diseño, se implementará
- `plan/shimmercloud/` → caso especial; ver su CLAUDE.md propio

**Nueva estructura de `docs/`:**
- `docs/templates/` → templates reutilizables (ej. system prompt RAG por defecto)
- `docs/agentes/` → fichas de agentes desplegados en Open WebUI

**Agente taller_servicio:** el patrón de reconversión de query + búsqueda bilingüe
ES+EN puede reutilizarse en otros agentes RAG. Ver `docs/agentes/taller_servicio.md`.
