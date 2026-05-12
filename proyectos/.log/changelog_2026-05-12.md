# Changelog — 2026-05-12

## tsamaps — Service tags como chips en Red de Clientes

### Cambios realizados

El campo `description` de los distribuidores pasa de mostrarse como texto en cursiva a renderizarse como chips/etiquetas individuales, tanto en el popup del mapa como en las tarjetas del panel lateral.

- `app.js`: `dealer.description` se parsea por `, ` y cada fragmento se envuelve en `<span class="service-tag">`. Afecta popup del marcador y tarjeta del panel lateral.
- `index.css`: eliminada clase `.dealer-desc` (texto muted en cursiva); añadidas `.service-tags` (flex-wrap con gap 4px) y `.service-tag` (pill azul con fondo rgba(0,118,214,0.08), borde y border-radius 20px).
- `index.html`:
  - Texto del modal "¿Qué es TSA Maps?" reescrito: "carta náutica interactiva" → "aplicativo web interactivo con datos marítimos en tiempo real".
  - Créditos: añadido "(Desarrollo full-stack)" al rol de Luis Conde.

---

## openweb — generate_doc: eliminado formato TXT

### Cambios realizados

- Eliminada la función `generate_txt()` y todo su soporte: icono, color, rama de detección de extensión `.txt`.
- Añadida nota docstring en `generate_md()`: `Para contenido HTML: NO uses esta tool. Escribe el HTML directamente en el chat.`
- Actualizado el campo `description` del encabezado de la tool (eliminado "TXT" de la lista de formatos soportados).

---

## docker — prod.yml: eliminada variable DDGS_BACKEND

### Cambios realizados

- Eliminada la variable de entorno `DDGS_BACKEND=google` del servicio `open-webui` en `prod.yml`.
- Esta variable fue añadida en la sesión del 2026-05-07 como workaround para el backend de búsqueda web de DuckDuckGo. Se elimina porque la tool `web_search.py` gestiona el backend directamente, haciendo redundante la variable en el contenedor.

---

## Contexto técnico para agentes

**tsamaps — service tags:**
- Archivos: `.webapps/dev/tsamaps/app.js` (líneas ~666 y ~687), `.webapps/dev/tsamaps/index.css` (clases `.service-tags` y `.service-tag`).
- El parseo es `description.split(', ')` — el separador es `, ` (coma + espacio). Si los datos del JSON usan otro separador, los chips no se partirán correctamente.
- La clase `.dealer-desc` ha sido eliminada del CSS. No referenciarla.

**generate_doc.py — TXT eliminado:**
- Archivo: `.docker/openweb/tools/generate_doc.py`.
- La tool ya no puede generar `.txt`. Si el usuario pide un archivo de texto plano, redirigir a `.md` o CSV según el contenido.
- El motivo de la nota en `generate_md()` es que el modelo tendía a llamar a esta tool para generar HTML en lugar de renderizarlo directamente en el chat.

**prod.yml — DDGS_BACKEND:**
- Archivo: `.docker/compose/prod.yml`.
- La variable fue añadida como workaround temporal (sesión 2026-05-07). Su eliminación no afecta a `web_search.py`, que establece el backend vía `DDGS(backend="google")` en el código de la tool.
