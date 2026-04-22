# Workflow: Actualización de Open WebUI

> Procedimiento para agentes (Claude Code). Seguir los pasos en orden.

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

## Paso 7 — Verificar logs

```bash
docker logs open-webui --tail 50
```

Confirmar que no hay errores de arranque. Si los hay, detener y reportar al usuario.

---

## Paso 8 — Verificar UI

Comprobar que http://localhost:3000 responde y carga la interfaz correctamente.

---

## Paso 9 — Reportar al usuario

Informar de:
- Versión anterior
- Versión instalada
- Resultado de la verificación (logs + UI)
