---
name: docker-backup-manual
description: "Ejecuta backups manuales de Docker: volúmenes, Docker Compose, configuraciones de contenedores. Úsalo cuando necesites hacer un respaldo completo bajo demanda de tu entorno Docker. Sin automatización - tú controlas cuándo ejecutar."
category: devops
color: green
displayName: Docker Backup Manual
---

# Docker Backup Manual

Esta habilidad guía la ejecución manual de respaldos completos del entorno Docker.

## Procedimiento de Respaldo Manual

### Paso 1: Preparar estructura de directorios
```bash
# Linux/Mac
mkdir -p ~/.docker/backup/{volumes,compose,configs,logs}

# Windows PowerShell
New-Item -Path "$env:USERPROFILE\.docker\backup\volumes" -ItemType Directory -Force
New-Item -Path "$env:USERPROFILE\.docker\backup\compose" -ItemType Directory -Force
New-Item -Path "$env:USERPROFILE\.docker\backup\configs" -ItemType Directory -Force
New-Item -Path "$env:USERPROFILE\.docker\backup\logs" -ItemType Directory -Force
```

### Paso 2: Identificar qué respaldar
```bash
# Listar volúmenes Docker
docker volume ls

# Verificar docker-compose
ls -la docker-compose*.yml

# Listar contenedores ejecutándose
docker ps -a
```

### Paso 3: Ejecutar respaldo

**Opción A - Script automático (recomendado):**

Linux/Mac:
```bash
sh ~/.docker/backup/scripts/docker-backup.sh
```

Windows CMD/PowerShell:
```batch
C:\Users\[TuUsuario]\.docker\backup\scripts\docker-backup.bat
```

**Opción B - Comandos manuales individuales:**

**Respaldar volúmenes:**
```bash
for volume in $(docker volume ls -q); do
  docker run --rm -v $volume:/data -v ~/.docker/backup/volumes:/backup \
    alpine tar czf /backup/${volume}_$(date +%Y%m%d_%H%M%S).tar.gz -C / data
done
```

**Respaldar Docker Compose:**
```bash
BACKUP_DATE=$(date +%Y-%m-%d_%H-%M-%S)
mkdir -p ~/.docker/backup/compose/$BACKUP_DATE
cp docker-compose.yml ~/.docker/backup/compose/$BACKUP_DATE/ 2>/dev/null || true
cp docker-compose.override.yml ~/.docker/backup/compose/$BACKUP_DATE/ 2>/dev/null || true
docker-compose config > ~/.docker/backup/compose/$BACKUP_DATE/docker-compose-resolved.yml 2>/dev/null || true
```

**Respaldar configuración de contenedores:**
```bash
for container in $(docker ps -aq); do
  CONTAINER_NAME=$(docker inspect -f '{{.Name}}' $container | sed 's/^\///')
  mkdir -p ~/.docker/backup/configs/$CONTAINER_NAME
  docker inspect $container > ~/.docker/backup/configs/$CONTAINER_NAME/$(date +%Y%m%d_%H%M%S).json
done
```

### Paso 4: Verificar respaldos
```bash
# Ver estructura de respaldos
tree ~/.docker/backup/ 2>/dev/null || find ~/.docker/backup -type f | head -20

# Verificar tamaño
du -sh ~/.docker/backup/*

# Validar integridad de .tar.gz
tar -tzf ~/.docker/backup/volumes/[volumen].tar.gz | head
```

### Paso 5: Registrar en manifest.txt
Documentar manualmente en `~/.docker/backup/manifest.txt`:
```
2026-03-27 14:30:00 - Respaldo manual completo
  - Volúmenes: 3 respaldados
  - Compose: docker-compose.yml
  - Contenedores: 5 configuraciones
```

## Verificación Post-Respaldo

- [ ] ¿Archivos .tar.gz se comprimieron correctamente?
- [ ] ¿Docker-compose.yml está en directorio dated?
- [ ] ¿Configuraciones JSON de contenedores tienen datos?
- [ ] ¿Logs muestran ejecución sin errores?

## Restauración (cuando sea necesario)

```bash
# Restaurar volumen desde backup
docker volume create nuevo-volumen
docker run --rm -v nuevo-volumen:/data -v ~/.docker/backup/volumes:/backup \
  alpine tar xzf /backup/[volumen]_[TIMESTAMP].tar.gz -C /

# Restaurar docker-compose
cp ~/.docker/backup/compose/[FECHA]/docker-compose.yml ./
docker-compose up -d
```
