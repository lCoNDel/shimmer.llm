# Detener cualquier proceso en el puerto 5050
try {
    $port = 5050
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1

    if ($process) {
        Write-Host "Deteniendo proceso $process en el puerto $port..." -ForegroundColor Yellow
        Stop-Process -Id $process -Force
        Write-Host "Servidor detenido." -ForegroundColor Green
    } else {
        # Intento alternativo usando netstat si el cmdlet falla
        $netstat = netstat -ano | findstr ":$port"
        if ($netstat) {
            $pid = ($netstat[-1] -split '\s+')[-1]
            Write-Host "Forzando cierre de PID $pid..." -ForegroundColor Yellow
            taskkill /F /PID $pid
            Write-Host "Servidor detenido (vía taskkill)." -ForegroundColor Green
        } else {
            Write-Host "No hay ningún proceso escuchando en el puerto $port." -ForegroundColor Cyan
        }
    }
} catch {
    Write-Warning "Error al intentar detener el servicio: $_"
}
