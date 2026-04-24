#!/bin/bash
COMPOSE_FILE="$(dirname "$0")/../../../../.docker/compose/proxy.yml"
echo "Iniciando servidor web en http://localhost:5050..."
docker compose -f "$COMPOSE_FILE" up -d tsamaps_server
