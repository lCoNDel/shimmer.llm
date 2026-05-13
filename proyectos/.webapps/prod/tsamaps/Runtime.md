---
name: Web Service Manager
description: Una skill para iniciar y detener el servicio web tsamaps en el puerto 5050.
---

# Web Service Manager — PROD

Esta skill proporciona indicaciones para gestionar el servidor web del proyecto tsamaps.

## Funciones

1.  **Iniciar Servidor**: Levanta `tsamaps_server` (proxy.yml) en el puerto 5050.
2.  **Detener Servidor**: Para el contenedor.

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
> El contenedor Docker monta `prod/tsamaps` como `/app` y sirve el frontend + el proxy `/chat` hacia Open WebUI en el puerto 5050.

## Comportamiento esperado del agente

- **Iniciar**: ejecutar `start.ps1` con la herramienta PowerShell usando la ruta absoluta Windows exacta mostrada arriba.
- **Detener**: ejecutar `stop.ps1` con la herramienta PowerShell usando la ruta absoluta Windows exacta mostrada arriba.
- Usar **siempre rutas absolutas Windows** (`C:\Users\...`). Las rutas relativas (`./runtime/...`) fallan porque la herramienta PowerShell no hereda el directorio de trabajo del proyecto.
- No usar `bash` ni `.sh` para estas operaciones — PowerShell con `.ps1` es el método correcto en este entorno Windows.
- No verificar el estado HTTP con curl — se asume que el script funciona correctamente.
