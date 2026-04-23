#!/bin/bash
COMPOSE_FILE="$(dirname "$0")/../../../../.docker/compose/proxy.yml"

# Detener contenedor tsamaps_server
echo "Deteniendo tsamaps_server..."
docker compose -f "$COMPOSE_FILE" stop tsamaps_server
echo "Servidor detenido."

# Cerrar ngrok si está corriendo
powershell.exe -Command "Stop-Process -Name ngrok -Force -ErrorAction SilentlyContinue"
echo "Túnel ngrok cerrado (o no estaba activo)."
