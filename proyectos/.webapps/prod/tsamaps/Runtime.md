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
powershell -File ./runtime/tunnel.ps1
```

### Detener el túnel
`stop.sh` cierra ngrok automáticamente. El usuario también puede cerrar la ventana manualmente.

> [!NOTE]
> El servidor se inicia en segundo plano. Los logs se pueden ver en la terminal donde se ejecutó el script de inicio.

## Comportamiento esperado del agente

- Al iniciar el servicio, ejecutar el script **en segundo plano** (`run_in_background: true`) para evitar que bloquee el terminal. No verificar el estado HTTP con curl ni comprobar que responde — se asume que el script funciona correctamente.
- El túnel es opcional. Solo lanzarlo si el usuario lo pide explícitamente — por defecto, únicamente se inicia el servidor local.
- Para el túnel: ejecutar `powershell -File ./runtime/tunnel.ps1` y nada más. El script gestiona todo internamente.
- Al detener el servicio, `stop.sh` cierra siempre también ngrok, esté activo o no.
