#!/bin/bash
COMPOSE_FILE="$(dirname "$0")/../../../../.docker/compose/proxy.yml"

# Detener contenedor tsamaps_server
echo "Deteniendo tsamaps_server..."
docker compose -f "$COMPOSE_FILE" stop tsamaps_server_dev
echo "Servidor detenido."

# Cerrar proceso Node (http-server) en puerto 5050 si está corriendo
PID_NODE=$(powershell.exe -Command "(Get-NetTCPConnection -LocalPort 5050 -ErrorAction SilentlyContinue).OwningProcess" 2>/dev/null | tr -d '[:space:]')
if [ -n "$PID_NODE" ]; then
  powershell.exe -Command "Stop-Process -Id $PID_NODE -Force -ErrorAction SilentlyContinue"
  echo "Servidor Node (http-server) en puerto 5050 detenido (PID $PID_NODE)."
else
  echo "No había proceso Node en puerto 5050."
fi
