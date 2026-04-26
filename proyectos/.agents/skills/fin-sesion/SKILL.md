---
name: fin-sesion
description: Cierre de sesión de trabajo. Genera el changelog del día con los cambios realizados, lo guarda en .log/<proyecto>/ en la raíz de proyectos/, y crea el commit de git. Invocar con /fin-sesion al terminar una sesión de trabajo.
---

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

### 4. Actualizar CHANGELOG_INDEX.md

El índice vive en `.log/CHANGELOG_INDEX.md`. Permite recuperar contexto sin leer changelogs completos.

- Si no existe, crearlo con la cabecera y la tabla vacía (ver formato en el archivo existente).
- Por cada sección `##` nueva escrita en el changelog, añadir **una fila** al índice.
- Si una sección cubre temas muy distintos, dividirla en dos filas.
- **Insertar las nuevas filas al principio de la tabla** (orden cronológico inverso — lo más reciente primero).

Formato de cada fila:
```
| YYYY-MM-DD | área | tag1, tag2, tag3 | Resumen concreto en una línea (~80 chars) | changelog_YYYY-MM-DD.md |
```

- **Área**: proyecto o componente (`tsamaps`, `bots`, `docker`, `skills`, etc.)
- **Tags**: 2–5 palabras clave en minúsculas — nombres de funciones, componentes, plataformas, tipo de cambio (`bug`, `refactor`, `feature`, `responsive`, `mobile`, `limpieza`, etc.)
- **Resumen**: qué cambió concretamente, no por qué

### 5. Proponer el mensaje de commit

Mostrar al usuario un mensaje de commit sugerido (sin prefijo de tipo, descriptivo y en español) y los archivos que debería stagear. El usuario hace el commit a mano.

Formato de la propuesta:
```
Mensaje sugerido: "descripción corta de lo que se hizo"

Archivos a stagear:
  git add <archivo1> <archivo2> ...
```

Incluir siempre `.log/CHANGELOG_INDEX.md` en los archivos a stagear.

## Reglas

- **Nunca ejecutar el commit** — solo proponer el mensaje y los archivos. El usuario lo hace siempre a mano.
- **No inventar cambios** — el changelog refleja solo lo que realmente se hizo en la sesión.
- **Un changelog por día** — si ya existe el del día, actualizar en lugar de crear uno nuevo.
- **Idioma español** — tanto el changelog como la comunicación con el usuario.
