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

## docker — HTTPS en Open WebUI (intento revertido)

### Cambios realizados

Se intentó añadir HTTPS al puerto 3000 (Open WebUI) mediante variables de entorno `SSL_CERTFILE` / `SSL_KEYFILE` en `prod.yml`, montando los certificados Tailscale en `/certs`. El intento falló — Open WebUI no soporta SSL nativo vía variables de entorno (uvicorn no los recoge). Los cambios fueron revertidos y `prod.yml` quedó en su estado original. HTTPS solo está activo en el puerto 5050 (tsamaps, que sí usa uvicorn directo con `--ssl-certfile`).

---

## openweb — generate_doc: nota HTML en docstring generate_md

### Cambios realizados

Añadida nota en el docstring de `generate_md()` para evitar que el modelo la llame al generar HTML:
```
Para contenido HTML: NO uses esta tool. Escribe el HTML directamente en el chat.
```

---

## openweb — Prompts y Skills para demo dirección

### Trabajo realizado (sin archivos en repo)

Diseñados los siguientes prompts y skills para la demo de dirección de Touron S.A.:

- **Skill `analista-nautico-touron`**: rol de analista de negocio náutico para Open WebUI, formato ejecutivo estructurado.
- **Prompt `/nautica-electrica-informe`**: informe de oportunidad comercial sobre embarcaciones eléctricas con 2 búsquedas web (ES + EN, count=10).
- **Prompt `/nautica-github`**: búsqueda de repositorios náuticos en GitHub vía MCP, con lectura de README y commits del repo más activo.
- **Prompt de briefing náutico diario**: 2 búsquedas web (count=5), resumen en HTML inline con secciones ES/EN y nota de relevancia para Touron.

Nota: el HTML inline en chat tras tool calls falla por bug arquitectónico de Open WebUI (#9435) — el modelo no se reinvoca tras ejecutar tools. Workaround: reducir búsquedas a 2 con count=5 para no saturar la ventana de contexto.

---

## docker — Arranque de Docker Desktop tras fallo WSL

### Incidencia resuelta

Docker Desktop no arrancaba (pipe `dockerDesktopLinuxEngine` no encontrado). Causa: WSL quedó en estado `Stopped` tras apagado inconsistente. Solución aplicada:

1. `wsl --shutdown` — reset limpio de todas las distribuciones WSL
2. `Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"` — reiniicio de Docker Desktop
3. Inicio manual de contenedores: `open-webui`, `asistente_nautico`, `tsamaps_server_dev`, Tailscale y Ollama

---

## backlog — Demo ERP-IA: caso de uso análisis de negocio

### Trabajo realizado (archivado en `.backlog/demo_erp_ia/`)

Contexto: reunión con consultor de ERP Oracle que presentó un aplicativo IA para explotación de datos. Se diseñó e implementó un caso de uso equivalente para Shimmer LLM, finalmente archivado en `.backlog/` sin desplegar.

**Diseño:**
- Tool Python para Open WebUI que lee tres CSV (simulan tablas Oracle del ERP) montados en el contenedor vía bind mount en `prod.yml`.
- 50 referencias náuticas ficticias (Mercury, Jabsco, Simrad, QuickSilver) con histórico mensual 2020–2025 (~3600 filas de ventas, ~3600 de stock).
- 4 casos de uso con patrones construidos en los datos:
  1. Márgenes bajos con ventas crecientes (MRC-4T-1L: +126% ventas, margen estancado en 17.9%)
  2. Cruce stock-ventas para detectar demanda reprimida (JAB-18590: stock < 5u → ventas bloqueadas)
  3. Stock inmovilizado sin rotación (SIM-NSS9: 6u en stock, 0 ventas desde mayo 2025)
  4. Pronóstico trimestral por regresión lineal con estacionalidad (AZN-MRC75: ánodos zinc, pico Q3)

**Archivos generados:**
- `.backlog/demo_erp_ia/analisis_negocio.py` — tool Open WebUI v2.0 (lee CSVs desde `DATA_DIR`)
- `.backlog/demo_erp_ia/datos_touron/generar_datos.py` — script generador de CSVs (ya ejecutado)
- `.backlog/demo_erp_ia/datos_touron/productos.csv` / `ventas.csv` / `stock.csv` — datos listos
- `.backlog/demo_erp_ia/demo_erp_ia.md` — guía de demo con preguntas copiables
- `.backlog/demo_erp_ia/README.md` — instrucciones de implementación

**Motivo de archivo:** el bind mount en `prod.yml` no se llegó a aplicar (confirmación pendiente del usuario).

---

## docker — open-webui-dev: clon de Open WebUI en puerto 3002

### Cambios realizados

Creado entorno de desarrollo independiente para Open WebUI, clonando el servicio de producción en el puerto 3002 y compartiendo el mismo volumen `open-webui`.

- `dev.yml`: sustituido el placeholder `alpine` por el servicio `open-webui-dev` (imagen `v0.9.4`, puerto `3002:3000`, volumen `open-webui` externo compartido con prod).
- `.claude/ops/openweb-dev-start.ps1` / `openweb-dev-stop.ps1`: scripts de gestión equivalentes a los de prod.
- `.claude/commands/openweb-dev.md`: comando `/openweb-dev` para toggle start/stop desde Claude Code.

**Restricción de uso:** no arrancar `open-webui` (prod, puerto 3000) y `open-webui-dev` (puerto 3002) simultáneamente — comparten el volumen y pueden corromperse los datos.

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

---

## docker — Rebrand Open WebUI Dev (Touron LLM)

### Cambios realizados

Aplicado rebrand completo a `open-webui-dev` sin tocar código fuente ni rebuild de imagen:

- `WEBUI_NAME=Touron LLM` añadido en `dev.yml`
- Creado `.docker/branding/custom.css` — paleta azul marino Touron sobreescribiendo variables `--color-gray-*` de Tailwind v4. Estrategia: en dark mode se reemplaza la escala completa; en light mode solo se tocan grises oscuros para no romper tooltips/badges que asumen fondo claro.
- Creado `.docker/branding/favicon.png` — logo Touron (7 estilizado azul sobre fondo marino) redondeado con Pillow (radio 56px, 256×256px).
- `dev.yml`: bind mounts de `custom.css` y `favicon.png` a `/app/build/static/` (read-only).
- Parche `env.py` para eliminar sufijo ` (Open WebUI)`: `sed -i '131,132d' /app/backend/open_webui/env.py` — **se pierde al recrear el contenedor**, hay que reaplicar.

---

## docker — Reorganización de grupos Docker Compose

### Cambios realizados

Todos los compose renombrados con prefijo numérico para ordenarlos en Docker Desktop:

- `prod.yml` → `name: 1-produccion`
- `dev.yml` → `name: 2-desarrollo`
- `proxy.yml` → `name: 3-proxy`
- `bots.yml` → `name: 4-bots`

---

## docker — Eliminación de tsamaps_server_prod y limpieza

### Cambios realizados

- `tsamaps_server_prod` eliminado de `proxy.yml` — solo queda `tsamaps_server` (monta `dev/tsamaps`).
- `tsamaps_server_dev` renombrado a `tsamaps_server` en `proxy.yml`.
- Eliminados contenedores, imágenes y archivos de configuración de LibreChat (evaluado y descartado en favor de Open WebUI).
- `prod.yml` restaurado a estado limpio: solo `open-webui` + `anything-llm`.

---

## docker — LibreChat: evaluado y descartado

### Decisión

LibreChat desplegado como prueba (5 contenedores: API, MongoDB, MeiliSearch, PostgreSQL+pgvector, RAG API) y evaluado frente a Open WebUI. Conclusión: Open WebUI es la plataforma correcta para Touron. LibreChat eliminado completamente (contenedores, volúmenes, imágenes, archivos de configuración).

Motivos principales del descarte:
- 5 contenedores vs 1 de Open WebUI
- Panel admin es app separada aún en Preview (no incluida en imagen)
- No tiene equivalente a las tools Python de Open WebUI — reescribir todo en MCP
- Adquirido por ClickHouse en noviembre 2025 — virando hacia enterprise de datos
- Todo el trabajo de RAG, bots y tools está construido sobre Open WebUI y no es portable

---

## CLAUDE.md — Actualización completa

### Cambios realizados

- Stack técnico actualizado: v0.9.4, puertos correctos (dev en 3002, no 4000)
- Esquema de puertos corregido: eliminado rango 4000, añadido 3002, aclarado 5050
- Nueva sección `.docker/branding/`
- Nueva sección **Docker Compose — Grupos** con tabla y restricciones
- Nueva sección **Rebrand Open WebUI Dev** con comando del parche `env.py`
- `tsamaps_server_prod` eliminado de todas las referencias
- `tsamaps_server` (sin sufijo) como nombre definitivo del servicio proxy
- Estado del proyecto: LibreChat evaluado y descartado — Open WebUI decisión firme

---

## Contexto técnico para agentes

**Rebrand open-webui-dev:**
- El CSS se sirve automáticamente — `index.html` ya incluye `<link rel="stylesheet" href="/static/custom.css">`.
- Open WebUI usa Tailwind v4 con variables `--color-gray-*`. Sobreescribir estas variables en `:root` no funciona — hay que hacerlo en `html.dark` o `html.light` para que tengan prioridad.
- El sufijo ` (Open WebUI)` lo añade `env.py` líneas 131-132 cuando `WEBUI_NAME != 'Open WebUI'`. El parche con `sed -i '131,132d'` elimina esas líneas. **Se pierde al recrear el contenedor** (docker compose up con Recreate). Comando completo: `docker exec open-webui-dev sh -c "sed -i '131,132d' /app/backend/open_webui/env.py" && docker restart open-webui-dev`.
- El favicon en `/app/build/static/favicon.png` se sirve con `crossorigin="use-credentials"` — el navegador lo cachea agresivamente. Para forzar recarga: limpiar caché del navegador o acceder a la URL directa `/static/favicon.png`.

**tsamaps_server:**
- Nombre definitivo del servicio en `proxy.yml`. El contenedor anterior `tsamaps_server_dev` fue renombrado.
- Monta `.webapps/dev/tsamaps` — es el entorno de desarrollo activo.
- El error 429 de open-meteo (API de viento) aparece cuando el contenedor se reinicia muchas veces seguidas. Se recupera solo en minutos sin intervención.
- Acceso correcto: `https://pc-luis.bandicoot-stairs.ts.net:5050` (certificado Tailscale). `https://localhost:5050` da aviso de certificado inválido.

**Docker Compose — orden en Docker Desktop:**
- Los grupos aparecen en orden alfabético → los prefijos numéricos `1-`, `2-`, `3-`, `4-` garantizan el orden visual.
- Al cambiar el `name:` de un compose hay que recrear los contenedores para que aparezcan bajo el nuevo grupo.
