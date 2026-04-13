---
name: Web Service Manager
description: Una skill para iniciar y detener el servicio web local en el puerto 5050.
---

# Web Service Manager

Esta skill proporciona indicaciones para gestionar el servidor web local del proyecto OpenSea.

## Funciones

1.  **Iniciar Servidor**: Inicia un servidor web estático usando `npx http-server` en el puerto 5050.hj 
2.  **Detener Servidor**: Busca y finaliza el proceso que está escuchando en el puerto 5050.

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

> [!NOTE]
> El servidor se inicia en segundo plano. Los logs se pueden ver en la terminal donde se ejecutó el script de inicio.

## Comportamiento esperado del agente

- Al iniciar el servicio, ejecutar el script y nada más. **No verificar** el estado HTTP con curl ni comprobar que responde — se asume que el script funciona correctamente.
