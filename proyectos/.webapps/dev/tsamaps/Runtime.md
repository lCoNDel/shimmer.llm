---
name: Web Service Manager
description: Una skill para iniciar y detener el servicio web local en el puerto 5050.
---

# Web Service Manager

Esta skill proporciona indicaciones para gestionar el servidor web local del proyecto OpenSea.

## Funciones

1.  **Iniciar Servidor**: Inicia un servidor web estático usando `npx http-server` en el puerto 5050.
2.  **Detener Servidor**: Busca y finaliza el proceso que está escuchando en el puerto 5050.
3.  **Exponer a internet**: Lanza un túnel para hacer accesible el servicio desde fuera de la red local.

## Instrucciones de Uso

Para usar esta skill, puedes ejecutar los scripts correspondientes desde la terminal:

### Iniciar el servicio
```bash
bash ./runtime/start.sh
```

### Detener el servicio
```bash
bash ./runtime/stop.sh
```

### Exponer a internet (túnel)
```bash
# 1. Parar ngrok si ya está corriendo
powershell -Command "Stop-Process -Name ngrok -Force"

# 2. Abrir el bat en ventana visible
start "" "C:\Users\luisc\Desktop\Shimmer\Túnel\Cartógrafo.bat"
```

> Usar siempre `powershell Stop-Process` para matar ngrok — `/F` no funciona en bash (se interpreta como ruta).

### Detener el túnel
El cierre del túnel **lo hace el usuario manualmente** cerrando la ventana del bat. El agente no puede cerrar ventanas de cmd abiertas con `start`.

> [!NOTE]
> El servidor se inicia en segundo plano. Los logs se pueden ver en la terminal donde se ejecutó el script de inicio.

## Comportamiento esperado del agente

- Al iniciar el servicio, ejecutar el script y nada más. **No verificar** el estado HTTP con curl ni comprobar que responde — se asume que el script funciona correctamente.
- El túnel es opcional. Solo lanzarlo si el usuario lo pide explícitamente — por defecto, únicamente se inicia el servidor local.
- **Cerrar el túnel**: el agente no puede cerrar la ventana de cmd. Indicar al usuario que la cierre manualmente.
