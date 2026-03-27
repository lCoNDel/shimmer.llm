$port = 3001
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1

if ($process) {
    Write-Host "Deteniendo el proceso CRM (PID: $($process)) en el puerto $($port)..."
    Stop-Process -Id $process -Force
    Write-Host "Servicio detenido con éxito."
} else {
    Write-Host "No se encontró ningún proceso escuchando en el puerto $($port)."
}
