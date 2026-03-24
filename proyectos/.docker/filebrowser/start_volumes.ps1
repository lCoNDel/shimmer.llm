# Script para iniciar el FileBrowser maestro (Volumenes - Puerto 3002)
# Esto crea un contenedor independiente (no un Compose stack) para que se vea en una sola linea en Docker Desktop.

$name = "filebrowser"

if (!(Test-Path "$PSScriptRoot\fb-data\database\filebrowser.db")) {
    Write-Host "Inicializando base de datos por primera vez..." -ForegroundColor Yellow
    docker run --rm -v "$PSScriptRoot\fb-data\database:/database" filebrowser/filebrowser:latest config init -d /database/filebrowser.db
    docker run --rm -v "$PSScriptRoot\fb-data\database:/database" filebrowser/filebrowser:latest users add admin adminadmin123 --perm.admin -d /database/filebrowser.db
}

# 1. Comprobar si ya existe y detenerlo
if (docker ps -a --format '{{.Names}}' | Select-String -Pattern "^$name$") {
    Write-Host "Recreando el contenedor..." -ForegroundColor Gray
    docker stop $name
    docker rm $name
}

# 2. Iniciar el contenedor standalone
docker run -d --name $name --restart no `
  -p 3002:3002 `
  -v open-webui:/srv/open-webui:rw `
  -v anythingllm_storage:/srv/anything-llm:rw `
  -v "$PSScriptRoot\fb-data\srv:/srv" `
  -v "$PSScriptRoot\fb-data\config:/config" `
  -v "$PSScriptRoot\fb-data\database:/database" `
  filebrowser/filebrowser:latest `
  -a 0.0.0.0 -p 3002 -r /srv -d /database/filebrowser.db

Write-Host "¡Listo! FileBrowser maestro iniciado en http://localhost:3002" -ForegroundColor Green
Write-Host "Ahora deberias verlo como una sola linea en Docker Desktop." -ForegroundColor Gray
