# filebrowser — Inyectar FileBrowser en contenedores

Inyecta el binario FileBrowser en los contenedores `open-webui` y `anything-llm` para acceso interno a archivos.

## Instrucciones de Uso

```powershell
powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.claude\ops\filebrowser-inject.ps1"
```

## Comportamiento esperado del agente

- Ejecutar el comando anterior con la herramienta PowerShell usando la ruta absoluta Windows exacta.
- El script gestiona internamente qué contenedores están activos.
- Tras ejecutar, informar al usuario de las URLs resultantes:
  - http://localhost:8001 → FileBrowser dentro de open-webui
  - http://localhost:8002 → FileBrowser dentro de anything-llm
  - http://localhost:8000 → FileBrowser global (volúmenes, siempre disponible)
- No usar `bash` ni `.sh`.
