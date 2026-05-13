$proxyCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\proxy.yml"

Write-Host "Deteniendo tsamaps_server..."
docker compose -f $proxyCompose stop tsamaps_server
