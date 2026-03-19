# Registro de Sesión: Actualización Open WebUI e Instalación de Open-Terminal

Este documento detalla las acciones realizadas el 10 de marzo de 2026 para actualizar la infraestructura de LLM local.

## 1. Actualización de Open WebUI

Se detectó una instalación previa en la versión `v0.8.0`. Se procedió a actualizarla a la última versión estable.

### Acciones Realizadas:
- **Investigación:** Se identificó la versión `v0.8.10` como la última estable disponible en GHCR.
- **Modificación de Scripts:** Se actualizó [update.ps1](C:/Users/luisc/Documents/GitHub/shimmer.llm/proyectos/.docker/openwebui/update.ps1) para cambiar todas las referencias de `v0.8.0` a `v0.8.10`.
- **Documentación:** Se actualizó el [README.md](C:/Users/luisc/Documents/GitHub/shimmer.llm/proyectos/.docker/openwebui/README.md) local.
- **Ejecución:** Se corrió el script de actualización, el cual recreó el contenedor `open-webui` manteniendo el volumen persistente.

## 2. Instalación de Open-Terminal (Sandbox)

Se instaló Open-Terminal en paralelo para permitir ejecución de código segura.

### Configuración de Infraestructura:
- **Directorio:** Creada nueva carpeta en `.docker/open-terminal`.
- **Contenedor:** Se desplegó la imagen `ghcr.io/open-webui/open-terminal:main`.
- **Aislamiento:** Se creó un volumen independiente llamado `open-terminal`.
- **Seguridad:** Se configuró la API Key: `terminal-secret-key-123`.
- **Puerto:** Se mapeó al puerto host **8088**.

### Scripts Creados:
- `install.ps1`: Script automatizado para el despliegue del sandbox.

## Cómo conectar con Open WebUI (IMPORTANTE)

Según la documentación oficial, **NO** se debe añadir como una herramienta (Tool), sino como una **Integración**:

1.  Ve a **Ajustes de Administrador** (Admin Settings) > **Integraciones** (Integrations).
2.  Busca la sección **Open Terminal**.
3.  Habilita la conexión y configura:
    *   **URL:** `http://host.docker.internal:8088`
    *   **API Key:** `terminal-secret-key-123`
4.  Haz clic en **Guardar** (Save).

Al hacerlo así, aparecerá una barra lateral de archivos y las capacidades de terminal se activarán correctamente en los modelos compatibles.

---
*Documento generado por Antigravity.*
