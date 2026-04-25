$composeFile = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\proxy.yml"

Write-Host "Deteniendo tsamaps_server_prod..."
docker compose -f $composeFile stop tsamaps_server_prod
Write-Host "Servidor detenido."

Stop-Process -Name ngrok -Force -ErrorAction SilentlyContinue
Write-Host "Túnel ngrok cerrado."
