#!/bin/bash
# Detener cualquier proceso en el puerto 5050
PORT=5050
PID=$(netstat -ano | grep "TCP.*:${PORT}.*LISTENING" | awk '{print $5}' | head -1)

if [ -n "$PID" ]; then
    echo "Deteniendo proceso $PID en el puerto $PORT..."
    taskkill.exe //PID "$PID" //F
    echo "Servidor detenido."
else
    echo "No hay ningún proceso escuchando en el puerto $PORT."
fi
