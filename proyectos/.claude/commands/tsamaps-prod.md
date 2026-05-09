# tsamaps-prod — Gestión del servidor tsamaps PROD

Gestiona únicamente el contenedor `tsamaps_server_prod` (puerto 5050).

## Comportamiento esperado del agente

1. Comprobar si el contenedor `tsamaps_server_prod` está corriendo:
   ```powershell
   docker ps -q -f name=tsamaps_server_prod
   ```
2. Si devuelve un ID (está corriendo) → ejecutar **stop**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\tsamaps-prod-stop.ps1"
   ```
3. Si no devuelve nada (está detenido) → ejecutar **start**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\tsamaps-prod-start.ps1"
   ```

- No preguntar al usuario — actuar directamente según el estado detectado.
- Usar siempre rutas absolutas Windows. No usar `bash` ni `.sh`.
- No verificar el estado HTTP con curl.
