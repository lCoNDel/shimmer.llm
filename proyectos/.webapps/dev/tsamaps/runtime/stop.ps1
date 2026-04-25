$composeFile = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\proxy.yml"

Write-Host "Deteniendo tsamaps_server_dev..."
docker compose -f $composeFile stop tsamaps_server_dev
Write-Host "Servidor detenido."

Stop-Process -Name ngrok -Force -ErrorAction SilentlyContinue
Write-Host "Túnel ngrok cerrado."
