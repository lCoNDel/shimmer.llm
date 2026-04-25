$composeFile = "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.docker\compose\proxy.yml"

Write-Host "Iniciando tsamaps_server_dev en http://localhost:5050..."
docker compose -f $composeFile up -d tsamaps_server_dev

Stop-Process -Name ngrok -Force -ErrorAction SilentlyContinue
Start-Process -FilePath "C:\Users\luisc\Documents\NGROK\ngrok.exe" -ArgumentList "http 5050" -WindowStyle Normal
Write-Host "Túnel ngrok lanzado."
