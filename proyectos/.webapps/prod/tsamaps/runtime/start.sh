#!/bin/bash
# Iniciar servidor en el puerto 5050
cd "$(dirname "$0")/.."
echo "Iniciando servidor web en http://localhost:5050..."
npx --yes http-server -p 5050 --cors
