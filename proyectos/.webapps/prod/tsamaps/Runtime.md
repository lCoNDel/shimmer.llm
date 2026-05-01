---
name: Web Service Manager
description: Una skill para iniciar y detener el servicio web local en el puerto 5050.
---

# Web Service Manager — PROD

Esta skill proporciona indicaciones para gestionar el servidor web local del proyecto tsamaps en entorno de **producción**.

## Funciones

1.  **Iniciar Servidor**: Levanta `open-webui` (prod.yml), `asistente_nautico` (bots.yml) y `tsamaps_server_prod` (proxy.yml) en ese orden, y abre el túnel ngrok en el puerto 5050.
2.  **Detener Servidor**: Para los tres contenedores y cierra el túnel ngrok.

## Instrucciones de Uso

### Iniciar el servicio
```powershell
powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.webapps\prod\tsamaps\runtime\start.ps1"
```

### Detener el servicio
```powershell
powershell -File "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.webapps\prod\tsamaps\runtime\stop.ps1"
```

> [!NOTE]
> El servidor se inicia en segundo plano. El contenedor Docker monta esta carpeta (`prod/tsamaps`) como `/app` y sirve el frontend + el proxy `/chat` hacia Open WebUI en el puerto 5050.

## Comportamiento esperado del agente

- **Iniciar**: ejecutar `start.ps1` con la herramienta PowerShell usando la ruta absoluta Windows exacta mostrada arriba. Un solo comando lanza Docker + ngrok — no hay pasos separados.
- **Detener**: ejecutar `stop.ps1` con la herramienta PowerShell usando la ruta absoluta Windows exacta mostrada arriba. Para Docker y cierra ngrok en un solo paso.
- Usar **siempre rutas absolutas Windows** (`C:\Users\...`). Las rutas relativas (`./runtime/...`) fallan porque la herramienta PowerShell no hereda el directorio de trabajo del proyecto.
- No usar `bash` ni `.sh` para estas operaciones — PowerShell con `.ps1` es el método correcto en este entorno Windows.
- No verificar el estado HTTP con curl — se asume que el script funciona correctamente.
