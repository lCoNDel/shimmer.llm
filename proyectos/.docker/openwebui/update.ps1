# Script to update OpenWebUI to v0.8.10

# 1. Pull the new image
Write-Host "Pulling new image version v0.8.10..."
docker pull ghcr.io/open-webui/open-webui:v0.8.10

# 2. Stop and remove the old container
Write-Host "Stopping and removing existing container..."
docker stop open-webui
docker rm open-webui

# 3. Start the new container with preserved settings
Write-Host "Starting new container..."
docker run -d `
  -p 3000:8080 `
  -p 8082:8082 `
  -v open-webui:/app/backend/data `
  -e OLLAMA_BASE_URL=/ollama `
  -e ENV=prod `
  -e PORT=8080 `
  --name open-webui `
  --restart unless-stopped `
  ghcr.io/open-webui/open-webui:v0.8.10

Write-Host "Update complete! Please verify at http://localhost:3000"
