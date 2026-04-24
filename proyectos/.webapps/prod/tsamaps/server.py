from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

OPENWEBUI_URL = "http://host.docker.internal:3000"
API_KEY       = "sk-86be5033063c4e1488007be92f4b2196"
MODEL_ID      = "asistente-touron"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: list

@app.post("/chat")
async def chat(req: ChatRequest):
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            f"{OPENWEBUI_URL}/api/chat/completions",
            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
            json={"model": MODEL_ID, "messages": req.messages[-10:], "stream": False}
        )
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    data = response.json()
    return {"response": data["choices"][0]["message"]["content"]}

# static files van al final para no solapar rutas de API
app.mount("/", StaticFiles(directory="/app", html=True), name="static")
