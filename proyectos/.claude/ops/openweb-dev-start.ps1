$devCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\dev.yml"

Write-Host "Iniciando open-webui-dev..."
docker compose -f $devCompose up -d open-webui-dev
Write-Host "Listo: http://localhost:3002"
