# tsamaps-prod — Gestión del servidor tsamaps (EOL)

> **Proyecto EOL desde 2026-06-12** — sin desarrollo activo. La app vive archivada en
> `webapps/antiguos/tsamaps/` y solo se arranca puntualmente para enseñar la demo.
> No proponer cambios ni mantenimiento sobre su código.

Gestiona el contenedor `tsamaps_server` (puerto 5050).

## Comportamiento esperado del agente

1. Comprobar si el contenedor `tsamaps_server` está corriendo:
   ```powershell
   docker ps -q -f name=tsamaps_server
   ```
2. Si devuelve un ID (está corriendo) → ejecutar **stop**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\tsamaps-prod-stop.ps1"
   ```
3. Si no devuelve nada (está detenido) → ejecutar **start**:
   ```powershell
   powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\tsamaps-prod-start.ps1"
   ```

## Demo completa (enseñar la web a alguien)

La web necesita open-webui (chat) y el bot además del servidor. Para la cadena completa:

- Arrancar: `powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\tsamaps-demo-start.ps1"`
- Parar: `powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\tsamaps-demo-stop.ps1"`

Arranca open-webui (prod, 3000) + asistente_nautico + tsamaps_server (5050, HTTPS Tailscale).

## Reglas

- No preguntar al usuario — actuar directamente según el estado detectado.
- Usar siempre rutas absolutas Windows. No usar `bash` ni `.sh`.
- No verificar el estado HTTP con curl.
