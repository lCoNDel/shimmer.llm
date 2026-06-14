$prodCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\docker\compose\prod.yml"

Write-Host "Deteniendo open-webui..."
docker compose -f $prodCompose stop open-webui
Write-Host "open-webui detenido."
