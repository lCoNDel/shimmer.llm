# Changelog — 2026-05-10

## tsamaps — HTTPS con Tailscale para habilitar GPS en móvil

### Problema

Con la migración de ngrok a Tailscale (2026-05-08), el acceso remoto a tsamaps pasó a ser HTTP puro (`http://100.x.x.x:5050`). Los navegadores móviles bloquean la API de geolocalización en orígenes no seguros, por lo que el GPS dejó de funcionar en acceso remoto. Con ngrok funcionaba porque ngrok provee HTTPS automático.

### Solución

Se habilitó HTTPS en el servidor uvicorn usando los certificados TLS emitidos por Tailscale (MagicDNS).

**Pasos realizados:**

1. Activado MagicDNS + HTTPS en el panel de Tailscale (`login.tailscale.com/admin → DNS`)
2. Generados los certificados con:
   ```powershell
   tailscale cert pc-luis.bandicoot-stairs.ts.net
   ```
   Archivos generados en `C:\Windows\System32\`
3. Copiados a `.docker/certs/` (nueva carpeta del proyecto):
   - `pc-luis.bandicoot-stairs.ts.net.crt`
   - `pc-luis.bandicoot-stairs.ts.net.key`
4. Editado `proxy.yml` — ambos servicios (dev y prod) ahora montan los certificados y arrancan uvicorn con TLS

### Cambios en `proxy.yml`

**Archivo:** `.docker/compose/proxy.yml`

Ambos servicios (`tsamaps_server_dev` y `tsamaps_server_prod`):

```yaml
volumes:
  - ../../.docker/certs:/certs:ro

command: sh -c "pip install fastapi uvicorn httpx ddgs -q && uvicorn server:app --host 0.0.0.0 --port 5050 --ssl-certfile /certs/pc-luis.bandicoot-stairs.ts.net.crt --ssl-keyfile /certs/pc-luis.bandicoot-stairs.ts.net.key"
```

### URL de acceso

```
https://pc-luis.bandicoot-stairs.ts.net:5050
```

El acceso por IP (`http://100.x.x.x:5050`) sigue funcionando pero sin GPS.

### Estado

- Verificado en producción desde móvil con Tailscale activo — GPS disponible.
- Contenedor activo: `tsamaps_server_dev` (prod estaba ocupando el mismo puerto 5050, se usa dev como servidor principal).

---

## Contexto técnico para agentes

**Rutas relevantes:**
- Certificados: `.docker/certs/pc-luis.bandicoot-stairs.ts.net.{crt,key}`
- Compose: `.docker/compose/proxy.yml`
- Dominio Tailscale: `pc-luis.bandicoot-stairs.ts.net` (tailnet: `bandicoot-stairs.ts.net`)

**Por qué los certs van en `.docker/certs/` y no en System32:**
Los certificados se generan por defecto en el directorio de trabajo de PowerShell (en este caso `C:\Windows\System32\`). Se mueven a `.docker/certs/` para poder montarlos limpiamente en el contenedor sin exponer System32 completo.

**Por qué uvicorn y no un proxy Caddy/nginx:**
El servidor es `python:3.11-slim` sin proxy inverso. Uvicorn soporta TLS nativo con `--ssl-certfile` / `--ssl-keyfile`, lo que es suficiente para este caso sin añadir complejidad.

**Renovación de certificados:**
Los certificados Tailscale tienen validez limitada (~90 días). Para renovar, ejecutar de nuevo:
```powershell
tailscale cert pc-luis.bandicoot-stairs.ts.net
```
Y copiar los nuevos archivos a `.docker/certs/`, luego reiniciar el contenedor.
