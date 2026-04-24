---
name: Web Service Manager
description: Una skill para iniciar y detener el servicio web local en el puerto 5050.
---

# Web Service Manager — DEV

Esta skill proporciona indicaciones para gestionar el servidor web local del proyecto tsamaps en entorno de **desarrollo**.

## Funciones

1.  **Iniciar Servidor**: Levanta el contenedor `tsamaps_server_dev` (Docker) en el puerto 5050.
2.  **Detener Servidor**: Para el contenedor y libera el puerto 5050.
3.  **Exponer a internet**: Lanza un túnel para hacer accesible el servicio desde fuera de la red local.

## Instrucciones de Uso

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
> El servidor se inicia en segundo plano. El contenedor Docker monta esta carpeta (`dev/tsamaps`) como `/app` y sirve el frontend + el proxy `/chat` hacia Open WebUI en el puerto 5050.

## Comportamiento esperado del agente

- Al iniciar el servicio, ejecutar **en este orden**: primero `start.sh` en segundo plano (`run_in_background: true`), luego `tunnel.ps1` con la herramienta PowerShell. Ambos se lanzan siempre juntos — servidor y túnel van en el mismo arranque.
- No verificar el estado HTTP con curl ni comprobar que responde — se asume que el script funciona correctamente.
- Para el túnel: ejecutar `powershell -File ./runtime/tunnel.ps1` con la herramienta PowerShell y nada más. El script usa `Start-Process -WindowStyle Normal` internamente para abrir ngrok en una ventana visible — es el script quien abre la ventana, no el agente. El agente no puede abrir ventanas directamente, pero esto no es necesario: el script lo gestiona correctamente. No intentar ningún otro enfoque.
- **Cerrar el túnel**: `stop.sh` lo cierra siempre. El agente no necesita hacer nada extra.
- `stop.sh` también mata el proceso Node (http-server) en el puerto 5050 si está corriendo fuera de Docker.
