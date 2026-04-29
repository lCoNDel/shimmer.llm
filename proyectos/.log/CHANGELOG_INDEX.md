<!-- ÍNDICE DE CHANGELOGS — leer primero, luego abrir solo el archivo relevante -->

# Índice de Changelogs

| Fecha | Área | Tags | Resumen | Archivo |
|---|---|---|---|---|
| 2026-04-29 | bot, telegram | rag, native, tool-calls, open-webui | Ciclo tool calls RAG client-side: get_model_kb_collections, run_knowledge_search, execute_tool_calls, call_openwebui loop 8 iter | changelog_2026-04-29.md |
| 2026-04-29 | bot, telegram | citas, chunks, regex, session | Sistema de citas: _session_chunks con índice global, regex [N] en respuesta final para mostrar fuentes reales | changelog_2026-04-29.md |
| 2026-04-29 | bot, telegram | foto, pendiente, qwen3.5, vision | PENDIENTE: handle_photo roto — modelo test (qwen3.5) no soporta visión; cambiar MODEL_ID a asistente-touron | changelog_2026-04-29.md |
| 2026-04-29 | bot, telegram | logging, timeout, limpieza, comentarios | timeout 120→300s, logging INFO, comentarios en español, import re movido al top | changelog_2026-04-29.md |
| 2026-04-26 | tsamaps, docker | logo, cabecera, ibb | Logo cabecera reemplazado por imagen propia en ibb.co | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | modal, info, copyright, comercial | Modal Información reescrito: lenguaje comercial, copyright propio, sin referencias Touron | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | chat, bienvenida, flag, duplicado | chatWelcomeShown flag: mensaje bienvenida solo en primera apertura de sesión | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | css, tap-highlight, mobile, reset | -webkit-tap-highlight-color: transparent en reset global; elimina efecto cuadrado en móvil | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | buscador, mobile, led, active | mobileSearchBtn led azul: add/remove active en apertura/cierre | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | chat, led, active, eliminado | Led azul chatBtn eliminado de CSS y JS | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | radio, led, active, bug, toggle | Led azul radio eliminado; listener reescrito con closeRadioPanel(); swipe-to-close corregido | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | gps, led, syncGpsShortcutBtn, isTrackingActive | syncGpsShortcutBtn(): led GPS vinculado a isTrackingActive como única fuente de verdad | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | weather, mobile, closed, init | Panel condiciones marítimas cerrado por defecto en móvil; desktop lo abre en init | changelog_2026-04-26.md |
| 2026-04-26 | docker, claude | filebrowser, inyectable, CLAUDE.md | CLAUDE.md actualizado: Filebrowser sin imagen Docker, inject_internal.ps1 | changelog_2026-04-26.md |
| 2026-04-26 | skills, log | índice, changelog, grep, contexto | CHANGELOG_INDEX.md creado con 63 entradas; skill fin-sesion actualizada con Paso 4 | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | gitignore, viento, json, runtime | wind-global.json y wind-timestamp.json excluidos de git con .gitignore + git rm --cached | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | radar, rainviewer, zoom, bug, tiles | RADAR_MAX_ZOOM 7→6, maxNativeZoom:6 maxZoom:18, tiles escalados en zoom alto | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | radar, animación, bug, parpadeo, load-event | Nueva capa con opacity:0, visible solo tras evento load, elimina capa anterior 200ms | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | radar, zoom, refactor, limpieza | Eliminado bloqueo de zoom, warnRadarZoomLocked, setMinZoom/setMaxZoom y zoomend listener | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | distribuidores, weather, bug, invalidateSize | Al seleccionar distribuidor: restaura weatherPanel y llama invalidateSize | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | vesselFinder, mob, desktop, layout | Botón Cerrar VesselFinder subido a bottom:120px para no solapar alerta MOB | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | responsive, tablet, mob, layout | Breakpoint tablet (769–1024px): MOB a right:60px bottom:20px alineado con botones | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | responsive, mobile, iphone, layout | Breakpoint ≤430px: botones 34px, gap 5px para iPhone 12 y similares | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | viento, open-meteo, feature, wind | Capa viento tiempo real Open-Meteo, rejilla España+Portugal, Leaflet-Velocity | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | viento, clip-path, bug, mobile | clip-path polygon sobre canvas velocity-overlay para recorte geográfico | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | mob, isSosActive, refactor, bloqueo | isSosLocked() eliminado, reemplazado por guard isSosActive en todos los listeners | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | mob, ui, coordenadas, emergencia | Panel MOB: distancia en NM, coordenadas al portapapeles, botones emergencia ES/PT | changelog_2026-04-26.md |
| 2026-04-26 | tsamaps | limpieza, html, css, huerfano | Código huérfano eliminado: comentarios, tooltips, IDs sin uso | changelog_2026-04-26.md |
| 2026-04-25 | tsamaps | runtime, powershell, docker, ngrok | start.ps1/stop.ps1 con rutas absolutas Windows, reemplaza .sh | changelog_2026-04-25.md |
| 2026-04-25 | tsamaps | server, cache, no-store | Cache-Control: no-store en estáticos, eliminados ?v=N de index.html | changelog_2026-04-25.md |
| 2026-04-25 | tsamaps | mobile, responsive, search-panel, bug | Panel Red de Clientes: fondo invisible en móvil, teclado móvil | changelog_2026-04-25.md |
| 2026-04-25 | tsamaps | weather, distribuidores, desktop, conflicto | closeWeatherPanel() al abrir Red de Clientes; restaura si weatherWasOpen | changelog_2026-04-25.md |
| 2026-04-25 | tsamaps | mob, emergencia, telefono, aguas | isInPortugueseWaters(), botones tel: 112/900202202/1520 según aguas | changelog_2026-04-25.md |
| 2026-04-25 | tsamaps | mob, vesselFinder, bloqueo | MOB desactiva VesselFinder directamente sin pasar por isSosLocked() | changelog_2026-04-25.md |
| 2026-04-25 | bot, telegram | bot, telegram, teclado, refactor | Teclado persistente, botón búsqueda web, borrar memoria con confirmación | changelog_2026-04-25.md |
| 2026-04-25 | bot, telegram | bot, telegram, pdf, pymupdf | Análisis de PDFs: extracción con pymupdf, flujo dos pasos, pdf_pending dict | changelog_2026-04-25.md |
| 2026-04-25 | skills | skills, fin-sesion, slash-command | Skill fin-sesion registrada como slash command en .claude/commands/ | changelog_2026-04-25.md |
| 2026-04-24 | tsamaps | chat, widget, mobile, desktop | Widget chat: botón flotante, panel glass, drawer móvil, toggle, exclusión mutua | changelog_2026-04-24.md |
| 2026-04-24 | tsamaps | chat, historial, timeout, sesion | Historial 10 mensajes, timeout 10min, indicador "Escribiendo...", enter para enviar | changelog_2026-04-24.md |
| 2026-04-24 | tsamaps | server, fastapi, proxy, chat | server.py FastAPI consolida estáticos + proxy /chat en puerto 5050 | changelog_2026-04-24.md |
| 2026-04-24 | tsamaps | docker, proxy-yml, runtime | proxy.yml: tsamaps_server en python:3.11-slim, host.docker.internal | changelog_2026-04-24.md |
| 2026-04-24 | tsamaps | mob, gps, ui | Botón MOB renombrado de SOS; GPS toggle correcto con clase active | changelog_2026-04-24.md |
| 2026-04-24 | skills | skills, log, changelog, fin-sesion | Nueva skill fin-sesion, carpeta .log/, changelogs centralizados | changelog_2026-04-24.md |
| 2026-04-23 | tsamaps | paneles, refactor, close-functions | closeWeatherPanel/Radio/Search/SunMoon/Chat: funciones centralizadas de cierre | changelog_2026-04-23.md |
| 2026-04-23 | tsamaps | paneles, swipe, mobile | addSwipeToClose: sunMoonPanel y chatPanel añadidos | changelog_2026-04-23.md |
| 2026-04-23 | tsamaps | mob, isSosLocked, bloqueo, radio, search | isSosLocked() en radioBtn y openSearchBtn, bloqueo MOB completo | changelog_2026-04-23.md |
| 2026-04-23 | tsamaps | gps, setInterval, fuga, bug | clearInterval(gpsMarineRefreshId) antes de nuevo setInterval | changelog_2026-04-23.md |
| 2026-04-23 | tsamaps | radar, setTimeout, fuga, bug | clearTimeout(radarLayerPrevTimeout) antes de cada setTimeout en radarShowFrame | changelog_2026-04-23.md |
| 2026-04-23 | tsamaps | mapa, click, consolidacion | Doble map.on('click') consolidado en handler único con dispatch por isRulerActive | changelog_2026-04-23.md |
| 2026-04-23 | tsamaps | html, css, limpieza, huerfano | Título TSA Maps, clases CSS muertas eliminadas, IDs huérfanos quitados | changelog_2026-04-23.md |
| 2026-04-21 | tsamaps | radar, zoom, bloqueo, bug | Zoom fijado a RADAR_MAX_ZOOM al activar radar, restaurado al desactivar | changelog_2026-04-21.md |
| 2026-04-21 | tsamaps | radar, race-condition, guard | Guard if(!isRadarActive) return tras await getRainViewerFrames() | changelog_2026-04-21.md |
| 2026-04-21 | tsamaps | radar, setInterval, fuga, anti-stacking | clearInterval antes de radarAnimInterval y radarRefreshInterval en radarStartAnim | changelog_2026-04-21.md |
| 2026-04-21 | tsamaps | radar, refresco, frames | radarRefreshFrames() cada 5 min (RADAR_REFRESH_MS), sin interrumpir animación | changelog_2026-04-21.md |
| 2026-04-08 | tsamaps | distribuidores, push, animacion | search-panel efecto push: width 0→400px con overflow:hidden, search-panel-inner | changelog_2026-04-08.md |
| 2026-04-08 | tsamaps | mareas, open-meteo, sea-level | Nueva tarjeta Nivel Mar con sea_level_height_msl de Open-Meteo Marine API | changelog_2026-04-08.md |
| 2026-04-08 | tsamaps | sol, luna, suncalc, feature | Panel Sol/Luna con SunCalc: amanecer, atardecer, fase lunar, coordenadas GPS/clic/centro | changelog_2026-04-08.md |
| 2026-04-08 | tsamaps | radio, panel, feature, mobile | Radio como panel independiente: radioBtn flotante, radioPanel, swipe-to-close | changelog_2026-04-08.md |
| 2026-04-08 | tsamaps | radio, feedback, animacion | Botón radio pulsa entre blanco/azul con radioIconPulse mientras reproduce | changelog_2026-04-08.md |
| 2026-04-08 | tsamaps | mapa, nowrap, minzoom, duplicacion | maxBounds, maxBoundsViscosity:1, noWrap:true, minZoom:4 en todas las capas | changelog_2026-04-08.md |
| 2026-04-08 | tsamaps | manual, ui, rediseno | Manual de Uso reescrito por categorías con iconos SVG inline | changelog_2026-04-08.md |
| 2026-04-08 | docker, claude | claude, produccion, proteccion | CLAUDE.md centralizado en proyectos/, doble autorización para prod/ | changelog_2026-04-08.md |
| 2026-04-01 | tsamaps | weather, animacion, in-place | renderWeatherGrid actualiza valores en-place con cardValueUpdate, sin parpadeo | changelog_2026-04-01.md |
| 2026-04-01 | tsamaps | responsive, mobile, tablet, feature | Nuevo responsive.css: drawers weather/search, buscador móvil, swipe-to-close | changelog_2026-04-01.md |
| 2026-04-01 | tsamaps | mobile, herramientas, exclusividad | Sistema exclusivo: abrir herramienta cierra mobileSearch y radio panel | changelog_2026-04-01.md |
| 2026-04-01 | tsamaps | gps, refresco, setInterval | GPS_MARINE_REFRESH_MS 5min: refresco periódico condiciones con última posición GPS | changelog_2026-04-01.md |
| 2026-04-01 | tsamaps | gps, shortcut, header, feature | gpsShortcutBtn en header: estados off/searching/active, syncGpsShortcut() | changelog_2026-04-01.md |
| 2026-04-01 | tsamaps | tooltips, mobile, touch | showToolLabel() + .tooltip-active + @media(hover:none) para touch | changelog_2026-04-01.md |
| 2026-03-31 | tsamaps | radar, animacion, multi-frame, feature | Animación multi-frame past+nowcast, HUD con progreso y controles ←/→/⏸ | changelog_2026-03-31.md |
| 2026-03-31 | tsamaps | gps, bloqueo, click, feedback | GPS activo: botón ámbar con gpsGlow, mensaje #gpsLockMsg bajo botón | changelog_2026-03-31.md |
| 2026-03-31 | tsamaps | permisos, banner, primera-visita | Banner permisos GPS+notificaciones en primera visita, localStorage flag | changelog_2026-03-31.md |
| 2026-03-31 | tsamaps | distribuidores, datos, enriquecimiento | 32 distribuidores con phone, email, web, address, description verificados | changelog_2026-03-31.md |
| 2026-03-31 | tsamaps | gps, fondeo, refactor, polling | onAnchorGpsUpdate(), gpsAutoStartedBy, isSosLocked(), elimina polling redundante | changelog_2026-03-31.md |
| 2026-03-30 | tsamaps | ux, toasts, fondeo, vessel | Toasts al desactivar modos, cuenta atrás fondeo, VesselFinder oculta controles | changelog_2026-03-30.md |
| 2026-03-30 | tsamaps | buscador, nominatim, ux | Spinner, botón limpiar, debounce 600ms, resultados ES, Escape cierra dropdown | changelog_2026-03-30.md |
| 2026-03-30 | tsamaps | radar, tiles, zoom, bug | URL tiles desde host+path API, zoom máximo 7 con radar activo | changelog_2026-03-30.md |
| 2026-03-11 | tsamaps | mob, gps, emergency, feature | MOB/SOS: bypass GPS activo, zIndex barco/MOB, zoom 17 durante emergencia | changelog_2026_03_11.md |
| 2026-03-11 | tsamaps | gps, weather, bloqueo | isTrackingActive bloquea clicks en mapa para no cambiar radar meteorológico | changelog_2026_03_11.md |
| 2026-03-11 | tsamaps | mob, feedback, ux | Botón SOS reacciona <50ms, texto "GPS...", latido tras fix satelital | changelog_2026_03_11.md |
