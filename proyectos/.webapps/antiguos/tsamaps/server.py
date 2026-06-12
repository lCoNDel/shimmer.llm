from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from ddgs import DDGS
import httpx
import logging
import os
import json
import math
import asyncio
from datetime import datetime, timezone
from pathlib import Path

OPENWEBUI_URL = "http://host.docker.internal:3000"
API_KEY       = "sk-894ef03db000417fa0fea94a2f1a3e13"
MODEL_ID      = "asistente-touron"
WEB_PREFIX    = "/web "

STATIC_DIR    = Path("/app")
WIND_JSON     = STATIC_DIR / "wind-global.json"
WIND_TS_FILE  = STATIC_DIR / "wind-timestamp.json"

# Rejilla España + Portugal + aguas próximas: lat 34–44°N, lon -12–5°E, paso 0.5°
GRID_LAT1, GRID_LAT2, GRID_DX = 34.0, 44.0, 0.5
GRID_LON1, GRID_LON2, GRID_DY = -12.0, 5.0, 0.5

WIND_UPDATE_INTERVAL = 3600  # segundos (1 hora)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: list

def search_web(query: str, max_results: int = 5) -> str:
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        if not results:
            return f"No se encontraron resultados web para: \"{query}\""
        lines = [f"Resultados de búsqueda web para: \"{query}\"\n"]
        for i, r in enumerate(results, 1):
            lines.append(f"{i}. {r['title']}\n   {r['body']}\n   Fuente: {r['href']}")
        return "\n".join(lines)
    except Exception as e:
        logging.error(f"Error en búsqueda web: {e}")
        return f"Error al realizar la búsqueda web: {e}"

async def fetch_wind_data():
    """Descarga viento de Open-Meteo y genera wind-global.json en formato Leaflet-Velocity."""
    lats = [round(GRID_LAT1 + i * GRID_DX, 1) for i in range(int((GRID_LAT2 - GRID_LAT1) / GRID_DX) + 1)]
    lons = [round(GRID_LON1 + j * GRID_DY, 1) for j in range(int((GRID_LON2 - GRID_LON1) / GRID_DY) + 1)]
    nx = len(lons)
    ny = len(lats)

    lat_str = ",".join(str(x) for x in lats * nx)  # cada lon repite todos los lats
    # Open-Meteo acepta múltiples coordenadas: repetimos cada lat para cada lon
    all_lats = []
    all_lons = []
    for lon in lons:
        for lat in lats:
            all_lats.append(lat)
            all_lons.append(lon)

    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={','.join(str(x) for x in all_lats)}"
        f"&longitude={','.join(str(x) for x in all_lons)}"
        "&current=wind_speed_10m,wind_direction_10m"
        "&wind_speed_unit=ms"
        "&timeformat=unixtime"
    )

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(url)
        response.raise_for_status()
        results = response.json()

    # Open-Meteo devuelve lista cuando hay múltiples puntos, objeto si es uno solo
    if isinstance(results, dict):
        results = [results]

    # Construir arrays U y V (componentes del viento)
    # Leaflet-Velocity espera la rejilla en orden: fila por fila, de arriba a abajo (lat mayor a menor)
    # y de izquierda a derecha (lon menor a mayor)
    u_data = []
    v_data = []

    for lon_idx, lon in enumerate(lons):
        for lat_idx, lat in enumerate(lats):
            point_idx = lon_idx * ny + lat_idx
            point = results[point_idx]
            speed = point.get("current", {}).get("wind_speed_10m", 0) or 0
            direction = point.get("current", {}).get("wind_direction_10m", 0) or 0
            # Convertir velocidad + dirección meteorológica a componentes U, V
            # Dirección meteorológica: de dónde viene el viento (0=N, 90=E...)
            dir_rad = math.radians(direction)
            u = -speed * math.sin(dir_rad)  # componente este-oeste
            v = -speed * math.cos(dir_rad)  # componente norte-sur
            u_data.append(round(u, 4))
            v_data.append(round(v, 4))

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    header_base = {
        "discipline": 0,
        "disciplineName": "Meteorological products",
        "gribEdition": 2,
        "center": 7,
        "centerName": "US National Weather Service - NCEP(WMC)",
        "refTime": now_iso,
        "significanceOfRT": 1,
        "productStatus": 0,
        "productType": 1,
        "parameterCategory": 2,
        "nx": nx,
        "ny": ny,
        "lo1": GRID_LON1,
        "la1": GRID_LAT2,  # Leaflet-Velocity espera la lat superior primero
        "lo2": GRID_LON2,
        "la2": GRID_LAT1,
        "dx": GRID_DY,
        "dy": GRID_DX,
        "parameterUnit": "m.s-1",
    }

    wind_json = [
        {
            "header": {**header_base, "parameterNumber": 2, "parameterNumberName": "U-component_of_wind"},
            "data": u_data
        },
        {
            "header": {**header_base, "parameterNumber": 3, "parameterNumberName": "V-component_of_wind"},
            "data": v_data
        }
    ]

    WIND_JSON.write_text(json.dumps(wind_json), encoding="utf-8")

    ts = datetime.now(timezone.utc).strftime("%d/%m/%Y %H:%M UTC")
    WIND_TS_FILE.write_text(json.dumps({"updated": ts}), encoding="utf-8")
    logging.info(f"Viento actualizado: {ts} ({nx}x{ny} puntos)")

async def wind_update_loop():
    while True:
        try:
            await fetch_wind_data()
        except Exception as e:
            logging.error(f"Error actualizando viento: {e}")
        await asyncio.sleep(WIND_UPDATE_INTERVAL)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(wind_update_loop())

@app.post("/chat")
async def chat(req: ChatRequest):
    messages = req.messages[-10:]
    last_user = next((m for m in reversed(messages) if m.get("role") == "user"), None)
    model = MODEL_ID
    if last_user and last_user.get("content", "").lower().startswith(WEB_PREFIX):
        query = last_user["content"][len(WEB_PREFIX):].strip()
        search_results = search_web(query)
        enriched_content = f"Usa los siguientes resultados de búsqueda web para responder:\n\n{search_results}\n\nPregunta: {query}"
        messages = [
            {**m, "content": enriched_content} if m is last_user else m
            for m in messages
        ]
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            f"{OPENWEBUI_URL}/api/chat/completions",
            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
            json={"model": MODEL_ID, "messages": messages, "stream": False, "chat_id": "local:tsamaps"}
        )
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    data = response.json()
    return {"response": data["choices"][0]["message"]["content"]}

@app.get("/wind-timestamp")
async def wind_timestamp():
    if WIND_TS_FILE.exists():
        return JSONResponse(json.loads(WIND_TS_FILE.read_text()))
    return JSONResponse({"updated": None})

@app.get("/{full_path:path}")
async def serve_static(full_path: str):
    path = STATIC_DIR / (full_path if full_path else "index.html")
    if path.is_dir():
        path = path / "index.html"
    if not path.exists():
        raise HTTPException(status_code=404)
    response = FileResponse(path)
    response.headers["Cache-Control"] = "no-store"
    return response
