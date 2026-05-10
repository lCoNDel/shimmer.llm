# Fin de Sesión — Cierre de Sesión

Ejecuta el cierre completo de una sesión de trabajo: changelog + commit.

## Flujo de Trabajo

### 1. Revisar los cambios de la sesión

```bash
git status
git diff --stat
```

Identifica qué archivos cambiaron y en qué área del proyecto (tsamaps, bots, docker, etc.).

### 2. Leer el contexto de los cambios

- Lee los diffs relevantes para entender qué se hizo.
- Si hay un changelog del día ya creado, léelo para no duplicar entradas.

### 3. Localizar o crear el changelog

Todos los logs van en `.log/` en la raíz de `proyectos/`, un archivo por día:

```
proyectos/.log/
└── changelog_YYYY-MM-DD.md
```

- Un único archivo por día. Si se trabajó en varios proyectos, agrupar en secciones dentro del mismo archivo.
- Si ya existe el changelog del día, actualizarlo — no crear uno nuevo.
- La fecha es siempre la del sistema (`currentDate` en memoria).

**Formato obligatorio** — leer al menos un changelog existente en `.log/` antes de escribir para respetar el estilo:
- Título: `# Changelog — YYYY-MM-DD`
- Secciones con `##` por área de cambio, subsecciones con `###`
- Al final, siempre una sección `## Contexto técnico para agentes` con rutas de archivos, variables de estado relevantes y snippets de código si aplica

### 4. Actualizar el índice de changelogs

Leer `.log/CHANGELOG_INDEX.md` y añadir una fila por cada entrada significativa del changelog del día. Si la entrada del día ya existe (porque el changelog se actualizó), añadir solo las filas nuevas.

Formato de cada fila (respetar el existente):
```
| YYYY-MM-DD | área1, área2 | tag1, tag2, tag3 | Resumen en una línea | changelog_YYYY-MM-DD.md |
```

- Las filas nuevas van al principio de la tabla (orden cronológico inverso).
- Una fila por bloque temático, no una por cada cambio menor.
- Los tags deben ser consistentes con los ya usados en el índice (reutilizar antes de inventar).

### 5. Proponer el mensaje de commit

Mostrar al usuario un mensaje de commit sugerido (sin prefijo de tipo, descriptivo y en español) y los archivos que debería stagear. El usuario hace el commit a mano.

Formato de la propuesta:
```
Mensaje sugerido: "descripción corta de lo que se hizo"

Archivos a stagear:
  git add <archivo1> <archivo2> ...
```

## Reglas

- **Nunca ejecutar el commit** — solo proponer el mensaje y los archivos. El usuario lo hace siempre a mano.
- **No inventar cambios** — el changelog refleja solo lo que realmente se hizo en la sesión.
- **Un changelog por día** — si ya existe el del día, actualizar en lugar de crear uno nuevo.
- **Idioma español** — tanto el changelog como la comunicación con el usuario.
- **Contexto del "por qué" en cambios críticos** — al documentar cambios de valores o funciones que, si se modifican sin entender el motivo, rompen el servicio (timeouts, límites de iteraciones, flags de control de flujo, constantes estructurales), incluir en la sección `## Contexto técnico para agentes` el motivo técnico y el comportamiento observable si el valor es incorrecto. No aplicar a cambios menores o estéticos.
