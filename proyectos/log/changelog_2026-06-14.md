# Changelog — 2026-06-14

## estructura — Reestructuración de carpetas de `proyectos/`

### Motivación

La convención de punto delante de todas las carpetas (`.docker/`, `.backlog/`, `.log/`, etc.) resultaba confusa: `.claude/` es tooling de Claude Code y el punto tiene sentido ahí, pero el resto de carpetas son contenido del proyecto donde el punto no transmite ningún significado real.

Adicionalmente, `.backlog/` mezclaba dos cosas distintas: un bloc de notas libre de ideas sin compromiso y proyectos ya en proceso de revisión o implementación.

### Decisión de diseño

**Convención nueva:** el punto en nombres de directorio queda reservado exclusivamente para `.claude/` (tooling externo que impone la ruta). El resto de carpetas no llevan punto.

Las tres carpetas relacionadas con planificación y trabajo futuro se agrupan bajo `plan/`:
- `plan/ideas/` — bloc de notas libre, ideas sueltas sin estructura ni compromiso
- `plan/backlog/` — ideas en proceso de revisión o implementación activa
- `plan/shimmercloud/` — plan de migración a Azure (objetivo noviembre 2026)

### Renames realizados (git mv)

| Antes | Después |
|---|---|
| `.agents/` | `agents/` |
| `.backlog/` | `plan/backlog/` |
| `.docker/` | `docker/` |
| `.docker/.bots/` | `docker/bots/` |
| `.docs/` | `docs/` |
| `.log/` | `log/` |
| `.shimmercloud/` | `plan/shimmercloud/` |
| `.tunnel/` | `tunnel/` |
| `.webapps/` | `webapps/` |

Nueva carpeta creada: `plan/ideas/.gitkeep` (vacía — bloc de notas libre).

### Archivos actualizados

**`.claude/ops/*.ps1` (11 scripts):**
- Patrón `.docker\compose\` → `docker\compose\` en todas las variables de ruta.

**`docker/compose/dev.yml`:**
- Bind mounts absolutos: `.docker\branding\` → `docker\branding\` (3 líneas).

**`docker/compose/bots.yml`:**
- Ruta relativa: `../.bots/telegram` → `../bots/telegram` (2 líneas).

**`docker/compose/proxy.yml`:**
- `../../.webapps/antiguos/tsamaps` → `../../webapps/antiguos/tsamaps`
- `../../.docker/certs` → `../../docker/certs`

**`.claude/commands/fin-sesion.md`:**
- 3 ocurrencias de `.log/` → `log/`.

**`.claude/commands/tsamaps-prod.md`:**
- `.webapps/antiguos/tsamaps/` → `webapps/antiguos/tsamaps/`.

**`plan/shimmercloud/CLAUDE.md`:**
- Referencia `../CLAUDE.md` → `../../CLAUDE.md` (profundidad aumenta un nivel).
- `.shimmercloud/` → `plan/shimmercloud/` en el árbol interno.
- `.webapps/antiguos/` → `webapps/antiguos/` en el resumen del entorno actual.

**`agents/skills/openweb-rebrand/SKILL.md`:**
- `.webapps\opensea\` → `webapps\opensea\`.

**`CLAUDE.md` (raíz):**
- Árbol de estructura completo reescrito con las nuevas rutas.
- Sección "Detalle de Carpetas" reescrita: nueva sección `plan/` explica las tres subcarpetas; `.docker/`, `.agents/`, `.log/`, `.tunnel/`, `.webapps/` actualizadas.
- Sección "Rebrand Open WebUI Dev": puntero `.docker/openweb/workflows/` → `docker/openweb/workflows/`.
- Sección "Reglas por zona": `.webapps/dev/`, `.webapps/prod/`, `.webapps/antiguos/` → sin punto.
- Sección "Convenciones": nueva regla del punto + rutas actualizadas a `agents/god/SKILL.md`, `docker/compose/prod.yml`, `plan/backlog/`, `log/`.
- Sección "Estado del Proyecto": `.shimmercloud/` → `plan/shimmercloud/`, `.webapps/antiguos/` → `webapps/antiguos/`, `.backlog/rag_sharepoint/` → `plan/backlog/rag_sharepoint/`.

### Verificación

Docker Compose validados tras los cambios:
```powershell
docker compose -f docker/compose/prod.yml config  # OK
docker compose -f docker/compose/dev.yml config   # OK
docker compose -f docker/compose/bots.yml config  # OK
docker compose -f docker/compose/proxy.yml config # OK
```
Los 4 resolvieron sin errores de ruta.

---

## Contexto técnico para agentes

**Convención nueva (permanente):**
> El punto en nombres de directorio está reservado para `.claude/` (tooling Claude Code). Ninguna otra carpeta de `proyectos/` lleva punto.

**Estructura de `plan/`:**
- `plan/ideas/` — libre, sin formato, sin revisión; ideas que no son aún backlog.
- `plan/backlog/` — proyectos con diseño o código (demo_erp_ia, rag_sharepoint, etc.); consultar antes de planificar trabajo nuevo.
- `plan/shimmercloud/` — migración Azure; leer su CLAUDE.md propio antes de trabajar en ello.

**Rutas operativas que cambian más:**
- Scripts ops: `proyectos\docker\compose\xxx.yml` (antes `.docker\compose\`)
- Dev bind mounts: `proyectos\docker\branding\` (antes `.docker\branding\`)
- Changelog diario: `proyectos/log/changelog_YYYY-MM-DD.md` (antes `.log/`)
- CHANGELOG_INDEX: `proyectos/log/CHANGELOG_INDEX.md`
- Skills: `proyectos/agents/skills/` (antes `.agents/skills/`)

**Rutas que NO cambian:**
- `.claude/` — permanece con punto (requerimiento de Claude Code).
- `CLAUDE.md` en raíz — permanece en raíz.
- Estructura interna de `docker/`, `agents/`, `webapps/` — sin cambios de contenido.

**Estado de contenedores al cierre (sin cambio respecto a sesión 2026-06-12):**
- `open-webui` (prod, 3000): **PARADO** — pendiente de validar dev v0.9.6.
- `open-webui-dev` (3002): en validación con v0.9.6.
- Bot asistente_nautico: sin servicio mientras prod esté parado.
