# Changelog — 2026-03-30

## UX
- Toasts informativos al desactivar modos exclusivos (tráfico, radar, viento, regla)
- Cuenta atrás visible en el panel de alarma de fondeo antes del cierre automático (15s)
- Modo VesselFinder oculta todos los controles flotantes y el botón SOS, mostrando solo un botón "Cerrar tráfico marítimo"
- Botón de Leyenda Náutica eliminado (pendiente rediseño)

## Buscador de direcciones
- Spinner de carga durante la búsqueda
- Botón limpiar (×) para borrar búsqueda y marcador
- Marcador de búsqueda independiente del marcador GPS
- Sin resultados muestra mensaje inline en lugar de `alert()`
- Debounce subido a 600ms para respetar el rate-limit de Nominatim
- Resultados en español (`accept-language: es`)
- `Escape` cierra el desplegable de sugerencias

## Radar de lluvia
- URL de tiles construida desde `host` + `path` de la API (corrige tiles en blanco)
- Zoom máximo limitado a 7 mientras el radar está activo (evita tiles de error)
- Zoom restaurado automáticamente al desactivar

## Correcciones
- `openLegendBtn` eliminado del JS (causaba error de ejecución al eliminar el botón del HTML)
- Todo el código muerto de la leyenda náutica eliminado (HTML, CSS, JS)
- Variables sin usar eliminadas: `baseLayer`, `index` en forEach, `anchorDistanceDisplay`
