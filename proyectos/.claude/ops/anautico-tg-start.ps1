$botsCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\bots.yml"

Write-Host "Iniciando asistente_nautico..."
docker compose -f $botsCompose up -d asistente_nautico
Write-Host "asistente_nautico iniciado."
