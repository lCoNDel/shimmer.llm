$devCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\docker\compose\dev.yml"

Write-Host "Deteniendo open-webui-dev..."
docker compose -f $devCompose stop open-webui-dev
Write-Host "open-webui-dev detenido."
