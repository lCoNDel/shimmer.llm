# Detener cualquier proceso en el puerto 5050
try {
    $port = 5050

    # Filtrar solo TCP en estado Listen para evitar confusión con entradas UDP del sistema
    $procId = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
              Select-Object -ExpandProperty OwningProcess -First 1

    if ($procId) {
        Write-Host "Deteniendo proceso $procId en el puerto $port..." -ForegroundColor Yellow
        Stop-Process -Id $procId -Force
        Write-Host "Servidor detenido." -ForegroundColor Green
    } else {
        Write-Host "No hay ningún proceso escuchando en el puerto $port." -ForegroundColor Cyan
    }
} catch {
    Write-Warning "Error al intentar detener el servicio: $_"
}
