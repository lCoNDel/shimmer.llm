# Script para inyectar FileBrowser en los contenedores (Acceso Interno)
$src = "$PSScriptRoot\filebrowser"

# 1. Verificar contenedores
$containers = @("open-webui", "anything-llm")
foreach ($c in $containers) {
    if (!(docker ps -q -f name=$c)) {
        Write-Host "Advertencia: El contenedor '$c' no está corriendo." -ForegroundColor Yellow
        continue
    }

    Write-Host "Inyectando en $c..." -ForegroundColor Cyan
    docker cp "$src" "$c`:/usr/local/bin/filebrowser"
    
    # Puerto basado en el contenedor
    $port = if ($c -eq "open-webui") { 8001 } else { 8002 }
    
    # Iniciar servicio en segundo plano
    docker exec -d $c sh -c "filebrowser -p $port -r / -a 0.0.0.0 -d /tmp/fb.db > /tmp/fb.log 2>&1"
    
    Write-Host "Listo: http://localhost:$port (Acceso Root Interno)" -ForegroundColor Green
}

Write-Host "`nRecuerda: El acceso fijo a Volumenes sigue en http://localhost:8000" -ForegroundColor White
