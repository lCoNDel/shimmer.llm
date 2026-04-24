from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ddgs import DDGS
import httpx
import logging

OPENWEBUI_URL = "http://host.docker.internal:3000"
API_KEY       = "sk-86be5033063c4e1488007be92f4b2196"
MODEL_ID      = "asistente-touron"
WEB_PREFIX    = "/web "

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

@app.post("/chat")
async def chat(req: ChatRequest):
    messages = req.messages[-10:]

    # Detectar /web en el último mensaje del usuario e inyectar resultados como contexto
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
            json={"model": MODEL_ID, "messages": messages, "stream": False}
        )
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    data = response.json()
    return {"response": data["choices"][0]["message"]["content"]}

# static files van al final para no solapar rutas de API
app.mount("/", StaticFiles(directory="/app", html=True), name="static")
