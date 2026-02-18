---
name: Open WebUI Rebrand
description: Completely rebrands an Open WebUI container (Title, Favicon, Splash, Logo) with user-provided assets.
---

# Open WebUI Rebranding Skill

This skill guides the agent through the process of customizing the Open WebUI instance running in Docker.

## 1. Gather Requirements

**CRITICAL:** Before proceeding, ask the user for the following information if not already provided:
1. **New Title**: What text should appear in the browser tab? (e.g. "Shimmer")
2. **Logo Image Path**: What is the absolute path to the local image file you want to use as the icon/logo?

> [!IMPORTANT]
> Ensure the image file exists at the provided path before continuing.

## 2. Execution Procedures

### Step 1: Change Browser Tab Title

The default Open WebUI appends " (Open WebUI)" to the title. We need to modify `env.py` to remove this behavior and set the custom name.

**Command to remove suffix logic:**
```bash
docker exec open-webui sed -i 's|if WEBUI_NAME != "Open WebUI":|# if WEBUI_NAME != "Open WebUI":|g' /app/backend/open_webui/env.py
docker exec open-webui sed -i 's|    WEBUI_NAME += " (Open WebUI)"|#     WEBUI_NAME += " (Open WebUI)"|g' /app/backend/open_webui/env.py
```

**Command to set new title:**
Replace `{{TITLE}}` with user's provided title.
```bash
docker exec open-webui sed -i 's|WEBUI_NAME = os.environ.get("WEBUI_NAME", "Open WebUI")|WEBUI_NAME = "{{TITLE}}"|' /app/backend/open_webui/env.py
```

### Step 2: Replace Branding Assets

We must replace multiple files in both `-backend` and `-build` directories to ensure the new logo appears everywhere (Favicon, Splash Screen, Apple Touch Icon, Manifest).

**Files to Replace:**
- `favicon.png`
- `favicon.ico`
- `splash.png`
- `logo.png`
- `apple-touch-icon.png`
- `web-app-manifest-512x512.png`

**Files to Remove:**
- `favicon.svg` (To force browser to use the png/ico)

**Execution Steps:**
1. **Copy user image** to the container. Run the following commands, replacing `{{IMAGE_PATH}}` with the user's provided path.

```powershell
# Backend Static Files
docker cp "{{IMAGE_PATH}}" open-webui:/app/backend/open_webui/static/favicon.png
docker cp "{{IMAGE_PATH}}" open-webui:/app/backend/open_webui/static/favicon.ico
docker cp "{{IMAGE_PATH}}" open-webui:/app/backend/open_webui/static/splash.png
docker cp "{{IMAGE_PATH}}" open-webui:/app/backend/open_webui/static/logo.png
docker cp "{{IMAGE_PATH}}" open-webui:/app/backend/open_webui/static/apple-touch-icon.png
docker cp "{{IMAGE_PATH}}" open-webui:/app/backend/open_webui/static/web-app-manifest-512x512.png

# Build Static Files (Frontend)
docker cp "{{IMAGE_PATH}}" open-webui:/app/build/static/favicon.png
docker cp "{{IMAGE_PATH}}" open-webui:/app/build/static/favicon.ico
docker cp "{{IMAGE_PATH}}" open-webui:/app/build/static/splash.png
docker cp "{{IMAGE_PATH}}" open-webui:/app/build/static/logo.png
docker cp "{{IMAGE_PATH}}" open-webui:/app/build/static/apple-touch-icon.png
docker cp "{{IMAGE_PATH}}" open-webui:/app/build/static/web-app-manifest-512x512.png

# Remove SVGs
docker exec open-webui rm /app/backend/open_webui/static/favicon.svg
docker exec open-webui rm /app/build/static/favicon.svg
```

### Step 3: Remove Splash Screen (Optional)

To hide the default Open WebUI logo during loading (F5 refresh), replace the splash images with a transparent 1x1 pixel PNG.

**Execution Steps:**
1. **Create Transparent Image**: Run this PowerShell command to generate `transparent.png`.
   ```powershell
   $bytes = [Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='); [IO.File]::WriteAllBytes('transparent.png', $bytes)
   ```

2. **Deploy to Container**:
   ```bash
   docker cp transparent.png open-webui:/app/build/static/splash.png
   docker cp transparent.png open-webui:/app/build/static/splash-dark.png
   ```

### Step 4: Verify and Restart

1. Restart the container to apply `env.py` changes.
   ```bash
   docker restart open-webui
   ```
2. Advise the user to clear browser cache ("Incognito mode") to see changes.
