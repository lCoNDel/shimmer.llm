# Changelog — 2026-05-15

## tsamaps — Corrección de conexión a Open WebUI prod + vuelta a API key

### Problema

El chat de tsamaps volvía a fallar con "Error al conectar con el asistente". El `server.py` quedó apuntando a `host.docker.internal:3002` (Open WebUI dev) tras la sesión del 2026-05-13, pero solo estaba activo `open-webui` prod en el puerto 3000. Además, la credencial era un JWT de sesión dev que devolvía 401 en prod.

### Causa raíz

Dos cambios no revertidos de la sesión anterior:
1. `OPENWEBUI_URL` quedó en `3002` — el contenedor dev no estaba corriendo.
2. `API_KEY` era un JWT obtenido en sesión de dev, no válido para prod (distinto firmante o usuario).

### Cambios aplicados

**`.webapps/prod/tsamaps/server.py`:**
- `OPENWEBUI_URL`: `host.docker.internal:3002` → `host.docker.internal:3000`
- `API_KEY`: JWT de sesión dev → `sk-894ef03db000417fa0fea94a2f1a3e13` (API key prod permanente)

### Estado tras el fix

Chat de tsamaps operativo. La API key no caduca (a diferencia del JWT de 30 días), por lo que este valor es estable a largo plazo salvo que se regenere manualmente desde Open WebUI.

---

## Contexto técnico para agentes

**`OPENWEBUI_URL` en `server.py`:**
- Valor correcto cuando solo está activo prod: `http://host.docker.internal:3000`
- Valor correcto cuando solo está activo dev: `http://host.docker.internal:3002`
- Recordar: no se pueden arrancar ambos simultáneamente (comparten volumen `open-webui`)

**`API_KEY` en `server.py`:**
- Usar siempre API key (`sk-...`) obtenida desde Open WebUI → Settings → Account → API Keys
- El workaround `"chat_id": "local:tsamaps"` ya está en el payload del request — sin él el endpoint devuelve 400 (bug Open WebUI v0.9.4)
- No usar JWT de sesión: caduca en 30 días y es específico del usuario/instancia con el que se obtuvo
- API key activa en prod: `sk-894ef03db000417fa0fea94a2f1a3e13`
