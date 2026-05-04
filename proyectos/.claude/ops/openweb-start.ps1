$prodCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\prod.yml"

Write-Host "Iniciando open-webui..."
docker compose -f $prodCompose up -d open-webui
Write-Host "Listo: http://localhost:3000"
