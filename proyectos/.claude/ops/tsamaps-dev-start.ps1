$proxyCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\proxy.yml"

Write-Host "Iniciando tsamaps_server_dev en http://localhost:5050..."
docker compose -f $proxyCompose up -d tsamaps_server_dev
