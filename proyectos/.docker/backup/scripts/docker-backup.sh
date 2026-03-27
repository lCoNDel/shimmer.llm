#!/bin/bash

# Docker Backup Script - Ejecución Manual
# Uso: sh docker-backup.sh

BACKUP_ROOT="$HOME/.docker/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TIMESTAMP_HUMAN=$(date +"%Y-%m-%d %H:%M:%S")
LOG_FILE="$BACKUP_ROOT/logs/backup_$TIMESTAMP.log"

# Crear directorios si no existen
mkdir -p "$BACKUP_ROOT/volumes"
mkdir -p "$BACKUP_ROOT/compose"
mkdir -p "$BACKUP_ROOT/configs"
mkdir -p "$BACKUP_ROOT/logs"

# Función para log
log_msg() {
  echo "$@"
}

# Iniciar log
{
  log_msg "==============================================="
  log_msg "DOCKER BACKUP - Ejecución Manual"
  log_msg "Timestamp: $TIMESTAMP_HUMAN"
  log_msg "==============================================="
  log_msg ""
  
  # Respaldar volúmenes
  log_msg "[1/3] Respaldando volúmenes Docker..."
  VOLUME_COUNT=0
  for volume in $(docker volume ls -q); do
    log_msg "  ✓ Respaldando volumen: $volume"
    if docker run --rm -v "$volume":/data -v "$BACKUP_ROOT/volumes":/backup \
      alpine tar czf "/backup/${volume}_${TIMESTAMP}.tar.gz" -C / data 2>&1; then
      VOLUME_COUNT=$((VOLUME_COUNT + 1))
    else
      log_msg "  ⚠ Error al respaldar volumen: $volume"
    fi
  done
  log_msg "  Total volúmenes respaldados: $VOLUME_COUNT"
  log_msg ""
  
  # Respaldar docker-compose
  log_msg "[2/3] Respaldando Docker Compose..."
  COMPOSE_DATE=$(date +%Y-%m-%d_%H-%M-%S)
  mkdir -p "$BACKUP_ROOT/compose/$COMPOSE_DATE"
  
  COMPOSE_FOUND=0
  
  if [ -f "docker-compose.yml" ]; then
    cp docker-compose.yml "$BACKUP_ROOT/compose/$COMPOSE_DATE/" 2>&1 && \
    log_msg "  ✓ docker-compose.yml respaldado"
    COMPOSE_FOUND=1
  fi
  
  if [ -f "docker-compose.override.yml" ]; then
    cp docker-compose.override.yml "$BACKUP_ROOT/compose/$COMPOSE_DATE/" 2>&1 && \
    log_msg "  ✓ docker-compose.override.yml respaldado"
  fi
  
  # Intentar docker-compose config (con fallback)
  if command -v docker &> /dev/null; then
    RESOLVED_FILE="$BACKUP_ROOT/compose/$COMPOSE_DATE/docker-compose-resolved.yml"
    
    # Intentar primero con "docker compose" (versión nueva)
    docker compose config > "$RESOLVED_FILE" 2>/dev/null
    
    # Si falla, intentar con "docker-compose" (versión vieja)
    if [ ! -s "$RESOLVED_FILE" ] 2>/dev/null; then
      docker-compose config > "$RESOLVED_FILE" 2>/dev/null || true
    fi
    
    # Validar que no está vacío
    if [ -s "$RESOLVED_FILE" ]; then
      log_msg "  ✓ docker-compose-resolved.yml generado"
    else
      rm -f "$RESOLVED_FILE" 2>/dev/null
      log_msg "  ℹ docker-compose-resolved.yml no generado (comando no disponible)"
    fi
  fi
  
  [ "$COMPOSE_FOUND" -eq 0 ] && log_msg "  ℹ No se encontró docker-compose.yml"
  log_msg ""
  
  # Respaldar configuración de contenedores
  log_msg "[3/3] Respaldando configuración de contenedores..."
  CONTAINER_COUNT=0
  for container in $(docker ps -aq); do
    CONTAINER_NAME=$(docker inspect -f '{{.Name}}' "$container" | sed 's/^\///')
    mkdir -p "$BACKUP_ROOT/configs/$CONTAINER_NAME"
    CONFIG_FILE="$BACKUP_ROOT/configs/$CONTAINER_NAME/${CONTAINER_NAME}_${TIMESTAMP}.json"
    
    if docker inspect "$container" > "$CONFIG_FILE" 2>&1; then
      log_msg "  ✓ Configuración respaldada: $CONTAINER_NAME"
      CONTAINER_COUNT=$((CONTAINER_COUNT + 1))
    else
      log_msg "  ⚠ Error al respaldar: $CONTAINER_NAME"
      rm -f "$CONFIG_FILE"
    fi
  done
  log_msg "  Total contenedores respaldados: $CONTAINER_COUNT"
  log_msg ""
  
  # Resumen final
  log_msg "==============================================="
  log_msg "RESPALDO COMPLETADO"
  log_msg "==============================================="
  log_msg "Ubicación: $BACKUP_ROOT"
  log_msg "Volúmenes: $VOLUME_COUNT"
  log_msg "Contenedores: $CONTAINER_COUNT"
  log_msg "Hora finalización: $(date +"%Y-%m-%d %H:%M:%S")"
  log_msg ""
  log_msg "Ver respaldos: ls -lR $BACKUP_ROOT"
  log_msg "Ver último log: tail -f $LOG_FILE"
  log_msg "==============================================="
  
} | tee "$LOG_FILE"

log_msg ""
log_msg "✅ Log guardado en: $LOG_FILE"

