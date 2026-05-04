$botsCompose = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\bots.yml"

Write-Host "Deteniendo asistente_nautico..."
docker compose -f $botsCompose stop asistente_nautico
Write-Host "asistente_nautico detenido."
