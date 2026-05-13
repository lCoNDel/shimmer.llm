$proxyCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\proxy.yml"
$prodCompose  = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\prod.yml"
$botsCompose  = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\bots.yml"

Write-Host "Deteniendo tsamaps_server_dev..."
docker compose -f $proxyCompose stop tsamaps_server_dev

Write-Host "Deteniendo asistente_nautico..."
docker compose -f $botsCompose stop asistente_nautico

Write-Host "Deteniendo open-webui..."
docker compose -f $prodCompose stop open-webui
