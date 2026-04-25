# Backlog — Funciones futuras Bot Telegram

## Grupos y comunidades

**Modo grupo**
Añadir el bot a grupos de Telegram (tripulación, equipo Touron) para que responda menciones `@touronsito_bot` sin interferir el resto de la conversación. El historial sería por grupo, no por usuario individual.

**Canal de alertas meteorológicas**
El bot publica automáticamente en un canal de Telegram avisos de condiciones peligrosas para zonas configuradas. Umbral de alerta configurable (altura de ola, velocidad de viento). Misma API que tsamaps (Open-Meteo Marine).

## Notificaciones proactivas

**Alertas programadas**
El usuario configura avisos periódicos: "Avísame cada mañana a las 8h con las condiciones en Cascais". El bot manda el resumen automáticamente sin que nadie lo pida. Requiere APScheduler o similar en el contenedor.

**Recordatorios de mantenimiento**
El usuario registra su embarcación y el bot le recuerda revisiones periódicas (cambio de aceite, zincs, ITV náutica).

## Interacción Telegram-nativa

**Modo inline**
Escribir `@touronsito_bot fondeo Cascais` en cualquier chat de Telegram y que devuelva resultados sin necesidad de abrir el bot. Requiere activar inline mode en BotFather (`/setinline`).

**Documentos PDF**
El usuario adjunta un PDF (manual de motor, ficha técnica, lista de material) y el bot extrae el texto y responde preguntas sobre él. Requiere pymupdf o pdfplumber.

**Notas de voz**
El usuario habla en lugar de escribir. El bot transcribe el audio con Whisper y procesa la transcripción como texto normal. Muy útil en navegación con las manos ocupadas. Requiere Whisper en Ollama o API externa.
