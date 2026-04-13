# Informe Técnico - Actualización v0.8 Beta

**Fecha:** 11 de Marzo de 2026
**Proyecto:** Shimmer OpenSea
**Versión:** 0.8 Beta

Este documento detalla los cambios técnicos, estabilizaciones y nuevas características integradas en el sistema de navegación y emergencias marítimas durante la sesión de actualización v0.8 Beta.

## 1. Integración de Sistema S.O.S (Hombre al Agua) y Rastreo GPS

Se ha rediseñado por completo la lógica que maneja la geolocalización de emergencias (MOB - Man Overboard) y el rastreo en tiempo real del barco, unificando ambos bajo un mismo motor GPS más robusto.

### 1.1. Resoluciones Críticas de Geoposicionamiento
- **Conflicto de "Timeout Expired" (Timeout del GPS):** Previamente, si el seguimiento activo estaba encendido y se lanzaba la alerta S.O.S, el navegador colapsaba al intentar ejecutar dos peticiones concurrentes de alta prioridad (`watchPosition` y `getCurrentPosition`).
  - *Solución:* Se implementó un "Bypass" de optimización. Ahora, si el rastreo está activo, el botón S.O.S reutiliza instantáneamente las coordenadas del `currentMarker` (barco) en lugar de solicitar un nuevo fix satelital, logrando una activación de latencia cero y eliminando el error de "Timeout".
- **Sincronización de Capas (Z-Index):** El marcador del barco (punto azul) podía quedar oculto debajo de chinchetas manuales o del propio marcador MOB.
  - *Solución:* Se forzó un `zIndexOffset` de `1100` para el marcador del barco y `1000` para el marcador S.O.S, garantizando que el barco sea siempre el elemento superior visible.
- **Forzado de Iconografía:** Se corrigió un bug visual donde el marcador del barco no actualizaba su icono de "chincheta" a "punto de navegación azul" al transicionar de clic manual a rastreo automático.

### 1.2. Sincronización de Comportamiento de Cámara (Zoom)
- **Conflicto de Niveles de Zoom:** La activación S.O.S solicitaba un nivel de zoom 17 (`setView(17)`), pero la rutina de inicio de rastreo automático posterior sobreescribía esta orden con un zoom nivel 12 (`flyTo(12)`), alejando peligrosamente la cámara del área de rescate.
  - *Solución:* Se introdujo una condición de estado en el bucle de seguimiento: `const zoomLevel = isSosActive ? 17 : 12;`. Esto obliga al motor a mantener un macro-zoom de alta precisión mientras la alerta de emergencia permanezca activa.

### 1.3. Lógica de Activación en Cadena de Emergencias
Se estructuró el flujo `activateSos(sosLatLng)` para ejecutar pasos críticos sin interrupción:
1. Fijar marcador permanente de víctima (MOB).
2. Hacer zoom crítico (Lvl 17) a las coordenadas.
3. Actualizar marcador del barco en el mismo milisegundo.
4. Mostrar panel HUD de emergencias con cálculos de distancia.
5. Forzar la activación del rastreo continuo (`watchPosition`) bloqueando la opción de apagarlo manualmente.

## 2. Bloqueo de Condiciones Meteorológicas (Weather Lock)

- Se modificó el EventListener de clics en el mapa.
- Cuando la variable `isTrackingActive` es `true` (el usuario está navegando), los clics manuales en el mapa quedan silenciados para evitar que cambien los datos del radar meteorológico que el barco está consultando en tiempo real.
- Esto permite al capitán interactuar, mover y hacer zoom en el mapa libremente sin perder los cálculos ambientales de su posición real.

## 3. Feedback Visual de Emergencia

- El botón flotante de S.O.S ahora reacciona en menos de 50ms al toque. 
- Muestra el texto "GPS..." y cambia a un color de alerta severo oscuro (`#e84118`) mientras el puente de geolocalización negocia la conexión con la API del navegador.
- Retorna al estado de "Flotador" y comienza a latir una vez fijadas las coordenadas, dando seguridad psicológica de que el sistema no está "colgado" durante la petición asíncrona.

---
**Estado de la Build:** Estable. Módulos de emergencia probados contra colisiones de redurso GPS del navegador.
