# openweb — Gestión de Open WebUI

Gestiona únicamente el contenedor `open-webui` (puerto 3000).

## Comportamiento esperado del agente

1. Comprobar si el contenedor `open-webui` está corriendo:
   ```powershell
   docker ps -q -f name=open-webui
   ```
2. Si devuelve un ID (está corriendo) → ejecutar **stop**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\openweb-stop.ps1"
   ```
3. Si no devuelve nada (está detenido) → ejecutar **start**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\openweb-start.ps1"
   ```

- No preguntar al usuario — actuar directamente según el estado detectado.
- Usar siempre rutas absolutas Windows. No usar `bash` ni `.sh`.
- No verificar el estado HTTP con curl.
