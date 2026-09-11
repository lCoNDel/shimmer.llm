# Changelog — 2026-09-11

## docker/backup — Limpieza de espacio y documentación del propósito

### Motivación

`docker/backup/` pesaba ~4,75 GB de los ~4,76 GB totales de `proyectos/`, sin que
el usuario supiera de dónde salía el espacio. Diagnóstico: dos backups del
volumen `open-webui` acumulados sin rotación.

### Cambios realizados

- Borrados `open-webui-backup-20260509.tar.gz` (2,34 GB) y
  `open-webui-backup-20260612.tar.gz` (2,41 GB) — ninguno estaba trackeado en
  git (`.gitignore` ya excluye `*.tar.gz`), así que el borrado es puramente de
  disco local.
- Creado `docker/backup/README.md`: propósito de la carpeta, criterio "solo
  backup de prod" (fijado 2026-06-12), comando exacto usado
  (`docker run --rm -v open-webui:/data ... tar czf`), referencia a los dos
  backups anteriores documentados en `log/2026/05/changelog_2026-05-09.md` y
  `log/2026/06/changelog_2026-06-12.md`, mención de la skill `docker-backup`
  (más completa pero no la que realmente se usa), y regla a futuro: borrar el
  backup anterior en cuanto la actualización que lo motivó quede validada, para
  no repetir la acumulación.

---

## Migración del repositorio a cuenta de empresa — tsa.shimmer

### Motivación

Luis traslada oficialmente el proyecto a una cuenta de empresa y deja de
trabajar en este PC. Encargo: reestructurar el repo separando con claridad tres
cosas que en la máquina nueva tienen vidas distintas — documentación (se sigue
usando), operativa Docker (se conserva pero no se puede ejecutar allí) y
utillaje de Claude Code (se sigue usando).

### Alcance de este cambio

**Todo el trabajo se hizo en una carpeta nueva y separada**,
`C:\Users\luisc\Documents\GitHub\tsa.shimmer`, copiada a partir de este repo
(`shimmer.llm/proyectos`). **Este repo no se ha modificado** más allá de lo
descrito en la sección anterior — queda intacto como backup local, tal como
pidió el usuario.

### Estructura resultante en tsa.shimmer

```
tsa.shimmer/
├── .claude/      # Claude Code — activa (commands + skills, ahora autodescubiertas)
├── docs/         # Documentación — activa (plan, log, arquitectura, negocio)
└── operativa/    # Producción — CONGELADA, no ejecutable en la máquina nueva
```

- **`.claude/skills/`**: las 9 skills se movieron desde `agents/skills/` (donde
  Claude Code no las autodescubría) más `agents/god/SKILL.md` →
  `.claude/skills/creador-habilidades/SKILL.md` (su propio frontmatter ya usaba
  ese nombre).
- **`docs/`**: `log/`, `plan/` y `docs/{agentes,templates}` → `docs/servicios/`
  íntegros; nuevo `docs/negocio/` para los documentos de estrategia que vivían
  dentro de `agents/skills/asesor-nautico/proyectos/` (se descartó el `.txt`
  duplicado de `estrategia_touron_2026.md`); nuevo
  `docs/arquitectura/puertos-y-stack.md` extraído del bloque técnico de
  `CLAUDE.md`.
- **`operativa/`**: `docker/` completo, nuevo `scripts/` (los 11 `.ps1` que
  vivían en `.claude/ops/`), `legacy/tsamaps/` y nuevo `legacy/agentes-web-2024/`
  (prototipos Python de 2024 que nunca habían viajado en ningún clon por estar
  en `.gitignore` — se incluyeron a petición expresa del usuario para no
  perderlos al abandonar este PC). `rag_sharepoint/` y `demo_erp_ia/` se
  partieron: diseño en `docs/plan/backlog/`, código ejecutable en
  `operativa/backlog/`.

### Peso muerto eliminado (documentado en `operativa/README.md` para recuperación futura)

| Qué | Motivo |
|---|---|
| `docker/filebrowser/filebrowser` (binario Linux, 15,5 MB) | Era el 99% del peso del repo; descargable de nuevo cuando haga falta |
| `docker/certs/pc-luis.bandicoot-stairs.ts.net.{crt,key}` | Clave TLS privada de Tailscale, atada al hostname de este PC |
| `docker/backup/query_knowledge.py.bak`, `.bak2` | Restos superados por la versión en `tools/stable/` |
| `webapps/antiguos/tsamaps/__pycache__/` | Artefacto de compilación |
| `tunnel/` completo (2 `.lnk` + 1 `.bat`) | Apuntaban a `C:\Users\luisc\Documents\NGROK`, fuera del repo e inservibles en cualquier otra máquina |
| `docker/openweb/tools/experimental/dev_*.py` (5) | Duplicaban `tools/stable/` a 3-5x de tamaño |
| `fb-data/database/filebrowser.db` | Duplicado de `fb-data/config/filebrowser.db` |

### Decisiones del usuario durante la sesión

- Volcado limpio, **sin historial** heredado (el repo de empresa ya lo había
  creado él mismo, vacío).
- Aplanar `proyectos/` a la raíz del repo nuevo.
- Zona operativa **congelada**: rutas absolutas `C:\Users\luisc\...` conservadas
  tal cual, sin reescribir — son el registro de un despliegue real, no una
  instrucción de uso.
- **Secretos fuera de alcance**: cuenta y repo de empresa son privados: los
  tokens/API keys que había en claro en el código (`asistente_nautico.py`,
  `server.py` de tsamaps) viajan sin modificar, por decisión explícita del
  usuario.
- `settings.json` reseteado (se quitó el `PowerShell(*)` abierto y los allows de
  docker/bash; se conservaron solo los 10 `WebFetch(domain:...)`).
  `settings.local.json` no viajó — tenía rutas de un experimento de duplicación
  de memoria hacia `tsa-shimmer` que ya no aplican.
- Trabajar en una **copia nueva** (`tsa.shimmer/`), dejando `proyectos/` como
  backup intacto en este PC.
- Al terminar, el usuario indicó que **no quería que se hiciera commit** — él
  mismo moverá la carpeta a mano al equipo nuevo y la subirá allí. Se había
  hecho un `git init` + commit inicial en `tsa.shimmer/` para validar la
  estructura; se eliminó el `.git` por completo a petición del usuario, dejando
  solo los archivos planos.

### Errores reales encontrados y corregidos durante la reestructura

No eran errores introducidos por la migración — ya estaban en el repo de origen
y se corrigieron de paso al tocar esos archivos:

- `docker/compose/prod.yml`: bind mounts de branding apuntaban a
  `proyectos\.docker\branding\` (con un punto de más) — roto desde antes;
  corregido al mismo path que ya usaba `dev.yml`.
- `agents/skills/openweb-rebrand/SKILL.md`: 11 referencias a
  `webapps\opensea\skills\openweb_rebrand\Touron logo.png`, una ruta que nunca
  existió con ese nombre (el asset real vive junto al `SKILL.md`).
- `agents/god/SKILL.md`: apuntaba a crear skills en `proyectos\.agents\skills\`
  (con punto) y mencionaba "Antigravity" en vez de Claude Code.
- `plan/shimmercloud/migracion/plan.md`: seguía citando `.shimmercloud/` (con
  punto) — un resto del refactor de eliminación de puntos del 2026-06-14 que
  nunca se terminó de propagar a este archivo.

### Verificación realizada (sobre tsa.shimmer)

- Los 5 `docker-compose.yml` validan con `docker compose -f <archivo> config -q`.
- Todos los enlaces relativos en Markdown (fuera de los changelogs históricos)
  resuelven a un archivo real.
- Los 11 scripts `.ps1` referenciados por los 5 slash commands operativos
  existen exactamente donde se los invoca.
- Ninguna referencia activa al peso muerto eliminado fuera de donde queda
  documentado a propósito en `operativa/README.md`.
- `LICENSE` confirmado idéntico (diff sin salida) entre el repo original y la
  copia.

---

## Continuación — ajustes en tsa.shimmer (LICENSE, .gitignore)

Todo lo de este bloque ocurrió también en `tsa.shimmer` (sin `.git`), no en
este repo. Sesión continuada tras el primer cierre del día.

### LICENSE eliminado

El usuario pidió borrar `LICENSE` de `tsa.shimmer`: era la licencia de
`shimmer.llm` que él mismo redactó para GitHub, y en el repo nuevo no va a usar
ninguna. Borrado, y actualizada la mención en `docs/STATUS.md` (§4) para dejar
constancia de que es una decisión, no un olvido.

### Bug real encontrado en el `.gitignore`

A petición del usuario de revisar el `.gitignore` con calma, se encontró un
problema real (no cosmético): la regla `filebrowser` (sin ruta ni barra) no
ignoraba solo el binario de 15,5 MB — al no estar anclada, Git la interpretaba
también como nombre de **carpeta**, así que `operativa/docker/filebrowser/`
entera (incluyendo `inject_internal.ps1` y la config de `fb-data/`, que sí
deben versionarse) habría quedado excluida en el primer `git add -A` que se
hiciera en la máquina nueva. Verificado el problema y el fix con un repo git
temporal (creado y borrado sin dejar rastro): la regla se corrigió a
`/operativa/docker/filebrowser/filebrowser` (ruta completa, ancla al archivo
exacto).

Aprovechando la revisión, se añadieron reglas de basura de sistema
operativo/editor (`Thumbs.db`, `desktop.ini`, `.DS_Store`) de cara a que la
máquina nueva pueda tener un entorno distinto.

### Decisión: subir tsa.shimmer completo, sin exclusiones de contenido real

El usuario aclaró que su intención es subir `tsa.shimmer` **tal cual está
hoy**, sin que nada del contenido actual se quede fuera. Esto entraba en
conflicto con dos reglas que sí excluían archivos reales presentes en disco:
`wind-global.json` y `wind-timestamp.json` (datos de viento en vivo de
tsamaps, en `operativa/legacy/tsamaps/`). Se quitaron ambas reglas del
`.gitignore` raíz y se borró por completo el `.gitignore` anidado de
`operativa/legacy/tsamaps/` (repetía las mismas dos reglas). Verificado con el
mismo método del repo git temporal: tras el cambio, cero archivos quedan
ignorados en el snapshot actual.

El resto de reglas del `.gitignore` (settings.local.json, `*.tar.gz`,
`__pycache__`, `.bak`, el binario de filebrowser, basura de SO) se dejaron —
no excluyen nada que exista hoy, son solo preventivas para archivos que Claude
Code o el propio uso normal puedan generar en la máquina nueva (no chocan con
"subir tal cual está hoy", que es sobre el contenido actual, no sobre higiene
futura).

### Aclaración sobre `.claude/settings.local.json` (sin cambio de código)

El usuario preguntó si, siendo "ruido", no sería mejor borrarlo directamente en
vez de solo ignorarlo. Se explicó la diferencia entre limpiar el **repo** (lo
consigue el `.gitignore`, sin tocar el archivo) y limpiar el **disco**
(borrarlo activamente, que rompería su función): ese archivo es donde Claude
Code recuerda permisos concedidos sesión a sesión en esa máquina — útil en
local, nunca debe viajar al repo compartido. Ahora mismo ni siquiera existe en
`tsa.shimmer/.claude/` (se descartó en la reestructura); la regla del
`.gitignore` es preventiva para cuando se regenere con el uso normal en la
máquina nueva.

---

## Contexto técnico para agentes

**Este repo (`shimmer.llm/proyectos`) sigue siendo la fuente operativa activa**
para cualquier tarea que se ejecute en este PC (arrancar contenedores, tocar
`docker/`, etc.) — nada de la reestructura lo afecta.

**El repo nuevo vive en `C:\Users\luisc\Documents\GitHub\tsa.shimmer`**, sin
`.git` todavía. El usuario lo moverá a mano a otro equipo y hará `git init` +
commit + push allí. Si una futura sesión trabaja sobre ese repo, la
reestructura completa (mapeo carpeta por carpeta, criterios de cada decisión,
inventario de peso muerto eliminado) está documentada en su propio
`CLAUDE.md` y `operativa/README.md` — no hace falta rederivarla.

**Pendiente para el usuario** (no bloqueante, fuera del alcance de esta
sesión): los tokens/API keys que quedaron en claro en
`docker/bots/telegram/asistente_nautico.py` y
`webapps/antiguos/tsamaps/server.py` no se tocaron por decisión explícita
("cuenta y repo privados"). Si en algún momento el repo de empresa deja de ser
privado, o se comparte con más gente, esos secretos deberían rotarse y
externalizarse a variables de entorno.
