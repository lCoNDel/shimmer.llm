# tsamaps (EOL) — arranque puntual de la demo completa: open-webui + bot + tsamaps_server
# La app vive archivada en .webapps/antiguos/tsamaps (montada por proxy.yml)
$proxyCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\docker\compose\proxy.yml"
$prodCompose  = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\docker\compose\prod.yml"
$botsCompose  = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\docker\compose\bots.yml"

Write-Host "Iniciando open-webui..."
docker compose -f $prodCompose up -d open-webui

Write-Host "Iniciando asistente_nautico..."
docker compose -f $botsCompose up -d asistente_nautico

Write-Host "Iniciando tsamaps_server en http://localhost:5050..."
docker compose -f $proxyCompose up -d tsamaps_server

