---
name: Web Service Manager
description: Una skill para iniciar y detener el servicio web local en el puerto 5050.
---

# Web Service Manager

Esta skill proporciona herramientas para gestionar el servidor web local del proyecto OpenSea.

## Funciones

1.  **Iniciar Servidor**: Inicia un servidor web estático usando `npx http-server` en el puerto 5050.
2.  **Detener Servidor**: Busca y finaliza el proceso que está escuchando en el puerto 5050.

## Instrucciones de Uso

Para usar esta skill, puedes ejecutar los scripts correspondientes desde la terminal:

### Iniciar el servicio
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ./runtime/start.ps1
```

### Detener el servicio
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ./runtime/stop.ps1
```

> [!NOTE]
> El servidor se inicia en segundo plano. Los logs se pueden ver en la terminal donde se ejecutó el script de inicio.
