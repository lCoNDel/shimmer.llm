# Script para restaurar Filebrowser tras actualizar Open WebUI
$container = "open-webui"
$binaryPath = "$PSScriptRoot\filebrowser"

# 1. Comprobar si el contenedor corre
if (!(docker ps -q -f name=$container)) {
    Write-Host "Error: El contenedor '$container' no está corriendo." -ForegroundColor Red
    exit 1
}

# 2. Copiar el binario dentro
Write-Host "Copiando Filebrowser al contenedor..."
docker cp $binaryPath "$container`:/usr/local/bin/"

# 3. Resetear contraseña de admin por seguridad
Write-Host "Reseteando contraseña de admin..."
docker exec $container filebrowser users update admin --password adminadminadmin --database /app/backend/data/filebrowser.db
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nota: Si falla el reset, puede que la DB esté bloqueada. Reinicia el contenedor." -ForegroundColor Yellow
}


# 4. Arrancar el proceso en segundo plano
Write-Host "Iniciando servicio..."
docker exec -d $container filebrowser -p 8082 -r / -a 0.0.0.0 -d /app/backend/data/filebrowser.db

Write-Host "¡Listo! Accede en http://localhost:8082" -ForegroundColor Green
Write-Host "Usuario: admin"
Write-Host "Password: adminadminadmin"
