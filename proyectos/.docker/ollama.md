# Ollama en Windows + Docker

Ollama corre **directamente en el host Windows** (no en Docker). Los contenedores se conectan a él mediante `host.docker.internal`, que Docker Desktop resuelve automáticamente a la IP del host.

## Variables de entorno configuradas en Windows

| Variable | Valor | Descripción |
|---|---|---|
| `OLLAMA_HOST` | `127.0.0.1:11434` | Interfaz y puerto donde escucha Ollama |
| `OLLAMA_KEEP_ALIVE` | `600` | Segundos que un modelo permanece cargado en memoria sin actividad |
| `OLLAMA_MAX_LOADED_MODELS` | `3` | Máximo de modelos simultáneamente en memoria |
| `OLLAMA_NUM_PARALLEL` | `4` | Peticiones paralelas que puede procesar |

## Cómo se conectan los contenedores

En los Docker Compose se usa:
```yaml
environment:
  - OLLAMA_BASE_URL=http://host.docker.internal:11434
```

`host.docker.internal` es un DNS especial que Docker Desktop para Windows resuelve automáticamente a la IP del host, permitiendo que los contenedores alcancen servicios que corren en Windows.

## Atención: OLLAMA_HOST y acceso desde Docker

`OLLAMA_HOST=127.0.0.1` significa que Ollama solo escucha en loopback (localhost). Esto **normalmente bloquearía** el acceso desde contenedores, pero Docker Desktop en Windows enruta `host.docker.internal` de forma que sí alcanza el loopback del host.

Si en algún momento la conexión falla desde un contenedor, cambiar a:
```
OLLAMA_HOST=0.0.0.0:11434
```
hace que Ollama escuche en todas las interfaces y elimina la ambigüedad. Se configura en las Variables de Entorno del sistema Windows (Panel de control → Sistema → Variables de entorno) y requiere reiniciar el servicio Ollama.

## Verificar conectividad desde un contenedor

```bash
docker exec -it open-webui curl http://host.docker.internal:11434/api/tags
```

Si responde con la lista de modelos, la comunicación es correcta.
