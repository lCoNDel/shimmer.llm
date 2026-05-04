# anautico-tg — Gestión del bot Asistente Náutico (Telegram)

Gestiona únicamente el contenedor `asistente_nautico`.

## Comportamiento esperado del agente

1. Comprobar si el contenedor `asistente_nautico` está corriendo:
   ```powershell
   docker ps -q -f name=asistente_nautico
   ```
2. Si devuelve un ID (está corriendo) → ejecutar **stop**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\anautico-tg-stop.ps1"
   ```
3. Si no devuelve nada (está detenido) → ejecutar **start**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\anautico-tg-start.ps1"
   ```

- No preguntar al usuario — actuar directamente según el estado detectado.
- Usar siempre rutas absolutas Windows. No usar `bash` ni `.sh`.
- No verificar el estado HTTP con curl.
