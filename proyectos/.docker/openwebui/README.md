# OpenWebUI Update - Technical Documentation

Este directorio contiene los scripts y documentación necesarios para la actualización de OpenWebUI a la versión **v0.8.10**.

## Archivos Incluidos
- `update.ps1`: Script de PowerShell que automatiza el proceso de actualización.

## Desglose Técnico del Proceso

El proceso de actualización realizado consta de los siguientes pasos técnicos:

### 1. Identificación y Respaldo de Configuración
Se inspeccionó el contenedor anterior (`docker inspect`) para recuperar la configuración crítica y asegurar que no se pierdan datos durante la recreación del contenedor.

**Configuración Preservada:**
- **Imagen:** `ghcr.io/open-webui/open-webui:v0.8.10` (Actualizada de `v0.8.0` a `v0.8.10`)
- **Puertos:**
  - `3000` -> `8080` (Interfaz Web)
  - `8082` -> `8082` (Uso interno/API)
- **Volúmenes:**
  - `open-webui` -> `/app/backend/data` (Persistencia de base de datos y chats)
- **Variables de Entorno:**
  - `OLLAMA_BASE_URL=/ollama`
  - `ENV=prod`
  - `PORT=8080`
- **Política de Reinicio:** `unless-stopped`

### 2. Actualización de Imagen
Se descargó la imagen específica para evitar inestabilidad con la etiqueta `main`:
```powershell
docker pull ghcr.io/open-webui/open-webui:v0.8.10
```

### 3. Recreación del Contenedor
Para aplicar la actualización, es necesario eliminar el contenedor efímero y recrearlo montando el volumen de datos existente.

**Comando de Ejecución (Replicado en `update.ps1`):**
```powershell
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
```

## Instrucciones de Uso
Para futuras actualizaciones o para reinstalar esta versión con la misma configuración, simplemente ejecute el script adjunto desde la raíz del proyecto:

```powershell
.\openwebui\update.ps1
```
