# openweb-dev — Gestión de Open WebUI Dev

Gestiona únicamente el contenedor `open-webui-dev` (puerto 3002).

## Comportamiento esperado del agente

1. Comprobar si el contenedor `open-webui-dev` está corriendo:
   ```powershell
   docker ps -q -f name=open-webui-dev
   ```
2. Si devuelve un ID (está corriendo) → ejecutar **stop**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\openweb-dev-stop.ps1"
   ```
3. Si no devuelve nada (está detenido) → ejecutar **start**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\openweb-dev-start.ps1"
   ```

- No preguntar al usuario — actuar directamente según el estado detectado.
- Usar siempre rutas absolutas Windows. No usar `bash` ni `.sh`.
- No verificar el estado HTTP con curl.
