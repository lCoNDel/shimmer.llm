$src = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\filebrowser\filebrowser"

$containers = @("open-webui", "anything-llm")
foreach ($c in $containers) {
    if (!(docker ps -q -f name=$c)) {
        Write-Host "Advertencia: El contenedor '$c' no está corriendo." -ForegroundColor Yellow
        continue
    }

    Write-Host "Inyectando en $c..." -ForegroundColor Cyan
    docker cp "$src" "$c`:/usr/local/bin/filebrowser"

    $port = if ($c -eq "open-webui") { 8001 } else { 8002 }

    docker exec -d $c sh -c "filebrowser -p $port -r / -a 0.0.0.0 -d /tmp/fb.db > /tmp/fb.log 2>&1"

    Write-Host "Listo: http://localhost:$port (Acceso Root Interno)" -ForegroundColor Green
}

Write-Host "`nRecuerda: El acceso fijo a Volúmenes sigue en http://localhost:8000" -ForegroundColor White
