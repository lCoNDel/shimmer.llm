$proxyCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\proxy.yml"

Write-Host "Deteniendo tsamaps_server_prod..."
docker compose -f $proxyCompose stop tsamaps_server_prod

Stop-Process -Name ngrok -Force -ErrorAction SilentlyContinue
Write-Host "Túnel ngrok cerrado."
