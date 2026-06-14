# Workflow: Actualización de Open WebUI

> Procedimiento para agentes (Claude Code). Seguir los pasos en orden.
>
> Los pasos usan prod (`prod.yml`, contenedor `open-webui`, puerto 3000). Para actualizar dev, sustituir por `dev.yml`, `open-webui-dev` y puerto 3002. Restricción de volumen compartido prod/dev: ver CLAUDE.md.

---

## Paso 1 — Leer versión instalada

Leer la línea `image:` del servicio `open-webui` en:

```
proyectos/.docker/compose/prod.yml
```

Extraer el tag (ejemplo: `v0.8.12`). Guardarlo como **versión actual**.

---

## Paso 2 — Consultar última versión disponible

Ir a: https://github.com/open-webui/open-webui/releases

Leer el tag del último release estable (no pre-release). Guardarlo como **versión nueva**.

---

## Paso 3 — Comparar versiones

- Si **versión actual == versión nueva**: Open WebUI ya está actualizado. Informar al usuario y detener el proceso.
- Si difieren: continuar con el paso 4.

---

## Paso 4 — Editar prod.yml

En `proyectos/.docker/compose/prod.yml`, sustituir el tag de la imagen del servicio `open-webui`:

```yaml
# Antes:
image: ghcr.io/open-webui/open-webui:<versión_actual>

# Después:
image: ghcr.io/open-webui/open-webui:<versión_nueva>
```

Confirmar el cambio antes de continuar.

---

## Paso 5 — Pull de la nueva imagen

Desde la raíz del repositorio (`shimmer.llm/`), ejecutar:

```bash
docker compose -f proyectos/.docker/compose/prod.yml pull open-webui
```

---

## Paso 6 — Recrear el contenedor

```bash
docker compose -f proyectos/.docker/compose/prod.yml up -d --force-recreate open-webui
```

---

## Paso 7 — Reaplicar parche rebrand (Touron LLM)

Al recrear el contenedor se pierde el parche de `env.py` que elimina el sufijo `(Open WebUI)` del nombre. Reaplicar con:

```bash
docker exec open-webui sh -c "sed -i '/^if WEBUI_NAME/,+1d' /app/backend/open_webui/env.py" && docker restart open-webui
```

Borra por patrón el bloque `if WEBUI_NAME != 'Open WebUI': WEBUI_NAME += ' (Open WebUI)'`. **No usar números de línea** — cambian con cada versión (131-132 en v0.9.4/0.9.5, 772-773 en v0.9.6). Verificar antes que el patrón existe y es único:

```bash
docker exec open-webui sh -c "grep -c '^if WEBUI_NAME' /app/backend/open_webui/env.py"
```

Si devuelve `0` (parche ya aplicado o código movido), no ejecutar el sed a ciegas — localizar el bloque con `grep -n 'Open WebUI' env.py` y reportar al usuario si ha cambiado.

---

## Paso 8 — Verificar logs

```bash
docker logs open-webui --tail 50
```

Confirmar que no hay errores de arranque y que las migraciones alembic terminaron. Si hay errores, detener y reportar al usuario.

---

## Paso 9 — Verificar UI

Comprobar que http://localhost:3000 responde y carga la interfaz correctamente, con el nombre "Touron LLM" sin sufijo.

---

## Paso 10 — Reportar al usuario

Informar de:
- Versión anterior
- Versión instalada
- Resultado de la verificación (logs + UI)
