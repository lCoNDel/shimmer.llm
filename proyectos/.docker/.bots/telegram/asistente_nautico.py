import re
import telebot
import requests
import json
import logging
import base64
import fitz
from ddgs import DDGS

# Bot de Telegram para el asistente náutico de Touron S.A.
# Conecta con Open WebUI vía API y gestiona el ciclo completo de tool calls
# para RAG con native function calling (el agente reformula queries antes de buscar).

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Configuración ---
TELEGRAM_TOKEN = "8633157162:AAFdIrMs-3jROMEb8jrIQUvi5vHFTUzLKaw"
OPENWEBUI_API_KEY = "sk-86be5033063c4e1488007be92f4b2196"
OPENWEBUI_BASE = "http://host.docker.internal:3000"
OPENWEBUI_URL = f"{OPENWEBUI_BASE}/api/chat/completions"
MODEL_ID = "asistente-touron"

# None = acceso abierto; lista de IDs para restringir usuarios
ALLOWED_USERS = None
WEB_PREFIX = "/web "

# System prompt inyectado en cada conversación
SYSTEM_PROMPT = """# Asistente Náutico Touron

## Rol

Eres Shimmer, asistente virtual náutico de Touron S.A. Responde siempre en el idioma del usuario. Preséntate brevemente al iniciar la conversación.

## Reglas

- Responde siempre en el idioma del usuario.
- Responde solo con información de este documento o de los resultados de `query_knowledge_files`.
- Si el dato no está aquí ni en los resultados de búsqueda, indica que no dispones de esa información y facilita el contacto adecuado.
- No facilites precios ni presupuestos, deriva siempre a concesionarios.
- Comparte contactos y datos del equipo siempre que ayuden al usuario.
- Si el mensaje incluye el encabezado "Resultados de búsqueda web para:", usa esos resultados como fuente principal para esa consulta. Al final de la respuesta, lista las fuentes utilizadas con su URL exacta.

## Querys

Llama a `query_knowledge_file` cuando necesites datos concretos que no tienes en este system prompt: especificaciones técnicas, números de pieza, procedimientos de mantenimiento, compatibilidades, etc.

**Formato de queries — cortas y precisas (3-6 palabras clave):**
- `query_es`: términos clave en español. Ejemplo: `"intervalos mantenimiento Verado V12"`
- `query_en`: mismos términos en inglés. Ejemplo: `"Verado V12 maintenance intervals"`

**Nunca uses frases largas ni repitas la pregunta del usuario como query.** Extrae solo las palabras clave relevantes.

No llames a `query_knowledge` si:
- La respuesta ya está en tu system prompt (datos corporativos, contactos, equipo, catálogo de productos)
- El usuario saluda, agradece o hace comentarios cortos sin pregunta técnica

## Uso de herramientas

Usa cada herramienta solo para su dominio:

- **query_knowledge_file**: documentación interna, manuales, fichas técnicas, repuestos, procedimientos propios de Touron

## Identidad Corporativa

- Razón Social: TOURON S.A. | NIF: A28237428
- Fundación: 1958 — primer distribuidor Mercury en España
- Grupo: Brunswick Marine EMEA
- Cifras: +50 empleados | +65 años | +300 clientes activos

## Contacto

**España** — C/ Mario Vargas Llosa, 20. 28850 Torrejón de Ardoz, Madrid
Tel: +34 91 657 27 73 | touron@touronsa.es | Lunes a Viernes desde las 09:30

**Portugal** — Cascais Office, R/C Sala B. Rotunda das Palmeiras, 2645-091 Alcabideche
Tel: +351 21 460 76 90 | geral@touronsa.pt

Web: touron.es/contacto · touron.es/localizacion · touron.es/productos · touron.es/noticias-y-blog
Manuales: download.brunswick-marine.com

## Equipo

**Consejo de Administración:** Fernando Giquel Alcocer (Presidente), Luis Giquel Alcocer (Vocal)

**Dirección General:** Fernando Giquel Elvira (Director Gerente), Álvaro Giquel Sosa (Director Gerente Operaciones)

**Fuerabordas & Embarcaciones:** Eduardo Lorenzi Abeijón (Director) · Comerciales: Álvaro Calvo, José Martín, Carlos Martín, Luis Fidalgo (PT) · Admin: Claudia Serrano, Rosana Astorga

**Repuesto & Accesorio:** Cristina Giquel Elvira (Directora) · Helder Mogadouro (Comercial) · Mariano González, Rafael Baretta (Atención Cliente)

**SAT:** Diego Sánchez Santamaría (Director) · Técnicos: Ángel García, José Machado, Pablo Zorzo · Garantías: Ángel Aparicio · Mecánicos: César Morillo, Daniel Sánchez

**Logística:** Ignacio Montes Abaurre (Director) · David Oporto, Javier Bautista, Sonia Barrios, María González

**Marketing:** María Lougedo Lorente (Directora) · Daniel Ávila, Esther Lapeña, Jeika Gotera

**Sistemas:** José Antonio Alcalá Palacios (Director) · Luis Conde (Sistemas), Jose Sanz (Oracle), Tomás Ruiz-Roso (Big Data), Viviana Franco (M365), Álvaro da Casa (Oracle) · Soporte G3 Mercury: Luis Conde

**Finanzas & Admin:** José Fernández Cabia (Director) · Contabilidad: Juana Fernández, Esther Froilan, Javier Sánchez · RRHH: Paula Martín · Admin PT: Helena Campos · Office: Patricia de Dios

## Productos

### Motores Fueraborda

- **Mercury Verado:** V12 7.6L 600CV, V10 5.7L 350–400CV, V8 4.6L 250–300CV — AMS, ARO, JPO, DTS
- **Mercury FourStroke:** 2.5–300 CV — uso general
- **Mercury Pro XS:** 115–300 CV — pesca deportiva y velocidad (Transient Spark)
- **Mercury SeaPro:** 15–500 CV — uso comercial (Heavy Duty)
- **Mercury ProKicker:** 9.9–25 CV — auxiliares y curricán
- **Mercury Racing:** R-Series (150R–500R), Competition (200 APX, 360 APX, 300 ROS)
- **Mercury Avator (eléctrico):** 7.5e–110e — Li-ion, app Mercury Marine

### Motores Inborda / Dentro-Fueraborda

- **MerCruiser:** 200–430 CV gasolina, SmartCraft de serie
- **Mercury Diesel:** 115–550 CV, turbo geometría variable, Common Rail, Zeus® (pods, joystick, Skyhook)
- **Cummins Marine Quantum:** QSB6.7 230–550CV, QSC8.3 490–600CV, QSL9 285–405CV, QSM11 300–715CV — EPA Tier 3 / IMO
- **Cummins Onan (generadores):** 4–110 kW, insonorizados, NMEA 2000
- **MotorGuide** (eléctricos pesca)

### Embarcaciones

- **Quicksilver:** Open, Sundeck, Cabin/Cruiser, Weekend, Pilothouse
- **Bayliner:** Element/Deck (M-Hull™), Trophy, VR Bowrider, Cuddy, Ciera — C21 Best of Boats 2025
- **Navan:** S30 y T30 — casco doble escalón, Zipwake, JPO
- **Heyday:** H20, H22 — wake boats, lastre digital
- **Quicksilver Inflatables:** Tendy, AirDeck, Sport, Alu-Rib
- **Talamex:** Aqualine, Comfortline, Highline, Greenline, Heavy Duty, Silverline
- **Walker Bay:** 2.5–3.5 m polipropileno, modulares — distribución exclusiva Iberia desde 2004

### Conectividad SmartCraft

- **VesselView:** pantallas táctiles, monitorización motor
- **VesselView Mobile:** telemetría Bluetooth al smartphone
- **SmartCraft Connect:** integración Garmin, Raymarine, Simrad
- **JPO:** atraque multimotores con joystick
- **Skyhook:** ancla digital GPS
- **Active Trim:** ajuste automático del ángulo del motor

### Accesorios y Repuestos

- **SeaChoice:** LED, eléctrico, anclajes, PFD, remolque
- **Attwood:** combustible, herrajes inox, bombas achique, ventilación (ABYC/USCG)
- **Mercury Precision Parts / Quicksilver Parts:** originales, lubricantes, filtros, ánodos, kits 100h/300h
- **Simrad, Lowrance, Land n Sea, Besto, OneUp, Radinn**
- Catálogo: +5.000 referencias, entrega 24–48h"""


# --- Utilidades de respuesta ---

def extract_answer(response_json: dict) -> str:
    # extrae el texto de la respuesta del modelo en formato openai-compatible.
    try:
        content = response_json['choices'][0]['message']['content']
        if not content:
            logging.warning(f"content vacío. Respuesta completa: {json.dumps(response_json, ensure_ascii=False)[:500]}")
        return content or ""
    except (KeyError, IndexError, TypeError) as e:
        logging.warning(f"extract_answer falló: {e}. JSON: {json.dumps(response_json, ensure_ascii=False)[:500]}")
        return ""


# --- RAG: discovery de knowledge bases ---

def get_model_kb_collections(headers: dict) -> list:
    # consulta la api de open webui para obtener los ids de knowledge bases asociadas al modelo.
    # sin caché — consulta siempre para reflejar cambios en la KB sin reiniciar el bot.
    try:
        resp = requests.get(f"{OPENWEBUI_BASE}/api/v1/models/model?id={MODEL_ID}", headers=headers, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            knowledge = data.get("meta", {}).get("knowledge", [])
            ids = [kb["id"] for kb in knowledge if isinstance(kb, dict) and kb.get("id")]
            logging.info(f"KB collections del modelo '{MODEL_ID}': {ids}")
            return ids
    except Exception as e:
        logging.warning(f"Error obteniendo KB collections del modelo: {e}")

    return []


# --- RAG: búsqueda en la knowledge base ---

def run_knowledge_search(query: str, headers: dict, session_chunks: list, session_chunk_counter: list) -> str:
    # ejecuta una búsqueda híbrida (semántica + bm25) en las colecciones del modelo y registra los chunks para el pie de fuentes.
    try:
        collection_names = get_model_kb_collections(headers)

        # Fallback: si el modelo no tiene colecciones en su config, listarlas directamente
        if not collection_names:
            kb_resp = requests.get(f"{OPENWEBUI_BASE}/api/v1/knowledge/", headers=headers, timeout=15)
            if kb_resp.status_code == 200:
                kbs = kb_resp.json()
                # La API puede devolver lista directa o paginada {"items": [...]}
                items = kbs if isinstance(kbs, list) else kbs.get("items", [])
                for kb in items:
                    if isinstance(kb, str):
                        collection_names.append(kb)
                    elif isinstance(kb, dict) and kb.get("id"):
                        collection_names.append(kb["id"])

        if not collection_names:
            logging.warning("No se encontraron colecciones KB accesibles")
            return "No se encontraron bases de conocimiento accesibles."

        logging.info(f"Buscando '{query}' en colecciones: {collection_names}")

        ret_resp = requests.post(
            f"{OPENWEBUI_BASE}/api/v1/retrieval/query/collection",
            headers=headers,
            json={"collection_names": collection_names, "query": query, "k": 15, "hybrid": True},
            timeout=60
        )

        logging.info(f"Retrieval status: {ret_resp.status_code}, response: {ret_resp.text[:300]}")
        if ret_resp.status_code != 200:
            logging.warning(f"Error retrieval ({ret_resp.status_code}): {ret_resp.text[:300]}")
            return "Error al buscar en la base de conocimiento."

        data = ret_resp.json()
        docs = data.get("documents", [[]])[0] if data.get("documents") else []
        metadatas = data.get("metadatas", [[]])[0] if data.get("metadatas") else []

        if not docs:
            return "No se encontraron resultados relevantes en la base de conocimiento."

        chunks = []
        for doc, meta in zip(docs, metadatas):
            session_chunk_counter[0] += 1
            idx = session_chunk_counter[0]
            source = meta.get("name", meta.get("source", "Desconocido"))
            page = meta.get("page_label", meta.get("page", ""))
            session_chunks.append({"index": idx, "source": source, "page": page})
            page_str = f" (p. {page})" if page else ""
            chunks.append(f"[{idx}] {source}{page_str}:\n{doc}")

        logging.info(f"Knowledge search OK: {len(docs)} chunks de {collection_names}")
        return "\n\n".join(chunks)

    except Exception as e:
        logging.exception("Error en run_knowledge_search")
        return f"Error al buscar: {e}"


def get_file_content(file_name_or_id: str, headers: dict, max_chars: int = 10000, offset: int = 0) -> str:
    # recupera el contenido de un archivo de la knowledge base por nombre o uuid.
    try:
        collection_names = get_model_kb_collections(headers)
        if not collection_names:
            kb_resp = requests.get(f"{OPENWEBUI_BASE}/api/v1/knowledge/", headers=headers, timeout=15)
            if kb_resp.status_code == 200:
                kbs = kb_resp.json()
                items = kbs if isinstance(kbs, list) else kbs.get("items", [])
                for kb in items:
                    if isinstance(kb, str):
                        collection_names.append(kb)
                    elif isinstance(kb, dict) and kb.get("id"):
                        collection_names.append(kb["id"])
        for kb_id in collection_names:
            kb_resp = requests.get(f"{OPENWEBUI_BASE}/api/v1/knowledge/{kb_id}", headers=headers, timeout=15)
            if kb_resp.status_code != 200:
                continue
            kb_data = kb_resp.json()
            files = kb_data.get("files") or []
            for f in files:
                f_id = f.get("id", "")
                f_name = f.get("meta", {}).get("name", f.get("filename", ""))
                if file_name_or_id in (f_id, f_name):
                    content_resp = requests.get(
                        f"{OPENWEBUI_BASE}/api/v1/files/{f_id}/content",
                        headers=headers, timeout=30
                    )
                    if content_resp.status_code == 200:
                        text = content_resp.text
                        chunk = text[offset:offset + max_chars]
                        logging.info(f"view_knowledge_file OK: {f_name}, {len(chunk)} chars")
                        return chunk
        return f"No se encontró el archivo '{file_name_or_id}'."
    except Exception as e:
        logging.exception("Error en get_file_content")
        return f"Error al leer el archivo: {e}"


# --- Ejecución de tool calls ---

def execute_tool_calls(tool_calls: list, headers: dict, session_chunks: list, session_chunk_counter: list) -> list:
    # ejecuta cada tool call del modelo y devuelve los resultados como mensajes role "tool".
    results = []
    for tc in tool_calls:
        tool_id = tc.get("id", "")
        function = tc.get("function", {})
        name = function.get("name", "unknown")
        try:
            args = json.loads(function.get("arguments", "{}"))
        except Exception:
            args = {}

        logging.info(f"Tool call: '{name}', args: {args}")

        if name in ("view_knowledge_file", "view_file"):
            file_id = args.get("file_id", args.get("filename", ""))
            max_chars = args.get("max_chars", 10000)
            offset = args.get("offset", 0)
            content = get_file_content(file_id, headers, max_chars, offset)
        else:
            query = args.get("query", args.get("q", args.get("search_query", "")))
            content = run_knowledge_search(query, headers, session_chunks, session_chunk_counter) if query else "No se encontró query en los argumentos."

        results.append({"role": "tool", "tool_call_id": tool_id, "content": content})
    return results


# --- Llamada principal a Open WebUI con bucle de tool calls ---

def call_openwebui(messages: list, headers: dict) -> str:
    # envía mensajes a open webui y gestiona el ciclo de tool calls hasta obtener la respuesta final (máx. 8 iteraciones).
    session_chunks: list = []
    session_chunk_counter: list = [0]
    current_messages = list(messages)

    for iteration in range(8):
        payload = {"model": MODEL_ID, "messages": current_messages, "stream": False}
        response = requests.post(OPENWEBUI_URL, headers=headers, json=payload, timeout=60)

        if response.status_code != 200:
            logging.error(f"Error Open WebUI ({response.status_code}): {response.text[:300]}")
            return None

        choice = response.json()["choices"][0]
        finish_reason = choice.get("finish_reason")
        content = choice["message"].get("content") or ""

        # Si el modelo terminó de generar (no hay más tool calls), construir respuesta final
        if finish_reason != "tool_calls" or content.strip():
            if not content.strip() and finish_reason != "tool_calls":
                logging.warning(f"content vacío (finish_reason={finish_reason})")

            # Añadir footer de fuentes si hubo búsquedas en KB
            if content.strip() and session_chunks:
                cited = set(int(m) for m in re.findall(r'\[(\d+)\]', content))
                seen = set()
                unique = []
                if cited:
                    for c in session_chunks:
                        if c["index"] in cited:
                            key = (c["source"], c["page"])
                            if key not in seen:
                                seen.add(key)
                                page_str = f" (p. {c['page']})" if c["page"] else ""
                                unique.append(f"{c['source']}{page_str}")
                else:
                    for c in session_chunks:
                        if c["source"] not in seen:
                            seen.add(c["source"])
                            unique.append(c["source"])
                if unique:
                    content = f"{content}\n\n📄 *Fuentes consultadas:*\n" + "\n".join(f"• {s}" for s in unique)

            return content

        # El modelo quiere ejecutar tool calls: procesarlas y continuar el bucle
        tool_calls = choice["message"].get("tool_calls", [])
        logging.info(f"[iter {iteration+1}] tool_calls: {json.dumps(tool_calls, ensure_ascii=False)}")

        tool_results = execute_tool_calls(tool_calls, headers, session_chunks, session_chunk_counter)
        current_messages.append({"role": "assistant", "content": "", "tool_calls": tool_calls})
        current_messages.extend(tool_results)

    logging.warning("Máximo de iteraciones de tool calls alcanzado")
    return ""


# --- Búsqueda web externa (DuckDuckGo) ---

def search_web(query: str, max_results: int = 10) -> str:
    # busca en duckduckgo y devuelve los resultados formateados como contexto para el modelo.
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


# --- Control de acceso ---

# Mensajes progresivos para usuarios no autorizados
UNAUTHORIZED_MESSAGES = [
    "Lo lamento pero no está usted autorizado para utilizar el agente, puede solicitar acceso a @CBLuiSo.",
    "Le digo que no está usted autorizado, vaya a dar un paseo, que corra el aire.",
    "Eres imbécil?",
    "Eso responde a mi pregunta, gracias.",
    "Chat Finalizado.",
]

unauthorized_attempts = {}


# --- Estado del bot ---

bot = telebot.TeleBot(TELEGRAM_TOKEN)

# Historial de conversación por usuario (en memoria, se pierde al reiniciar)
user_history = {}

# Usuarios que activaron el modo búsqueda web mediante el botón inline
web_mode_users = set()


# --- Teclados inline ---

def main_keyboard():
    # devuelve el teclado inline principal con los botones de búsqueda web y borrar memoria.
    markup = telebot.types.InlineKeyboardMarkup()
    markup.row(
        telebot.types.InlineKeyboardButton("🌐 Búsqueda Web", callback_data="web_search"),
        telebot.types.InlineKeyboardButton("🗑️ Borrar Memoria", callback_data="clear_memory")
    )
    return markup

def web_keyboard():
    # devuelve el teclado inline con el botón de cancelar búsqueda web.
    markup = telebot.types.InlineKeyboardMarkup()
    markup.row(telebot.types.InlineKeyboardButton("❌ Cancelar Búsqueda", callback_data="cancel_search"))
    return markup


# --- Handlers de comandos ---

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    # responde al comando /start y /help con el mensaje de bienvenida.
    if ALLOWED_USERS is not None and message.from_user.id not in ALLOWED_USERS:
        return
    bot.send_message(message.chat.id, "Shimmer Iniciado.", reply_markup=telebot.types.ReplyKeyboardRemove())

@bot.message_handler(commands=['web'])
def handle_web_command(message):
    # /web <consulta> — busca en internet e inyecta los resultados al modelo
    if ALLOWED_USERS is not None and message.from_user.id not in ALLOWED_USERS:
        uid = message.from_user.id
        attempt = unauthorized_attempts.get(uid, 0)
        unauthorized_attempts[uid] = attempt + 1
        if attempt < len(UNAUTHORIZED_MESSAGES):
            bot.reply_to(message, UNAUTHORIZED_MESSAGES[attempt])
        return

    parts = message.text.split(maxsplit=1)
    if len(parts) < 2 or not parts[1].strip():
        bot.reply_to(message, "Uso: /web <consulta>\nEjemplo: /web últimas noticias Mercury Marine")
        return

    query = parts[1].strip()
    user_id = message.from_user.id

    if user_id not in user_history:
        user_history[user_id] = {"messages": []}

    bot.send_chat_action(message.chat.id, 'typing')
    search_results = search_web(query)
    logging.info(f"Búsqueda web para '{query}': {len(search_results)} chars")

    # El resultado de la búsqueda se inyecta como contexto en el mensaje del usuario
    enriched_content = f"Usa los siguientes resultados de búsqueda web para responder:\n\n{search_results}\n\nPregunta: {query}"
    user_history[user_id]["messages"].append({"role": "user", "content": enriched_content})

    try:
        headers = {"Authorization": f"Bearer {OPENWEBUI_API_KEY}", "Content-Type": "application/json"}
        messages = user_history[user_id]["messages"][-10:]
        logging.info(f"Enviando /web a Open WebUI con {len(messages)} mensajes")

        answer = call_openwebui(messages, headers)
        if answer is None:
            bot.reply_to(message, "Lo siento, hubo un problema al conectar con Open WebUI.")
            return
        user_history[user_id]["messages"].append({"role": "assistant", "content": answer})
        if not answer.strip():
            bot.reply_to(message, "El modelo devolvió una respuesta vacía. Intenta reformular la consulta.")
            return
        if len(answer) > 4000:
            for i in range(0, len(answer), 4000):
                bot.send_message(message.chat.id, answer[i:i+4000], parse_mode='Markdown')
        else:
            bot.reply_to(message, answer, parse_mode='Markdown')
    except Exception as e:
        logging.exception("Error en /web")
        bot.reply_to(message, f"Ocurrió un error inesperado: {str(e)}")

@bot.message_handler(commands=['newchat'])
def reset_history(message):
    # Limpia el historial local del usuario sin afectar la memoria del modelo en Open WebUI
    if ALLOWED_USERS is not None and message.from_user.id not in ALLOWED_USERS:
        uid = message.from_user.id
        attempt = unauthorized_attempts.get(uid, 0)
        unauthorized_attempts[uid] = attempt + 1
        if attempt < len(UNAUTHORIZED_MESSAGES):
            bot.reply_to(message, UNAUTHORIZED_MESSAGES[attempt])
        return
    user_id = message.from_user.id
    user_history[user_id] = {"messages": []}
    bot.reply_to(message, "Conversación reiniciada. Se ha limpiado el historial local.")


# --- Handlers de contenido multimedia ---

@bot.message_handler(content_types=['photo'])
def handle_photo(message):
    # Convierte la imagen a base64 y la envía al modelo con visión.
    # No pasa por call_openwebui porque las imágenes no usan tool calls RAG.
    if ALLOWED_USERS is not None and message.from_user.id not in ALLOWED_USERS:
        uid = message.from_user.id
        attempt = unauthorized_attempts.get(uid, 0)
        unauthorized_attempts[uid] = attempt + 1
        if attempt < len(UNAUTHORIZED_MESSAGES):
            bot.reply_to(message, UNAUTHORIZED_MESSAGES[attempt])
        return
    user_id = message.from_user.id

    if user_id not in user_history:
        user_history[user_id] = {"messages": []}

    caption = message.caption or "Analiza esta imagen en detalle."
    bot.send_message(message.chat.id, "🖼️ Imagen recibida, espere por favor...")
    bot.send_chat_action(message.chat.id, 'typing')

    try:
        file_info = bot.get_file(message.photo[-1].file_id)
        downloaded = bot.download_file(file_info.file_path)
        image_b64 = base64.b64encode(downloaded).decode("utf-8")
        logging.info(f"Imagen descargada: {len(downloaded)} bytes. Caption: '{caption}'")

        image_message = {
            "role": "user",
            "content": [
                {"type": "text", "text": caption},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
            ]
        }

        headers = {"Authorization": f"Bearer {OPENWEBUI_API_KEY}", "Content-Type": "application/json"}
        payload = {"model": MODEL_ID, "messages": [image_message], "stream": False}
        logging.info(f"Enviando imagen a Open WebUI (base64: {len(image_b64)} chars)...")
        response = requests.post(OPENWEBUI_URL, headers=headers, json=payload, timeout=60)
        logging.info(f"Respuesta Open WebUI imagen: {response.status_code}")

        if response.status_code == 200:
            answer = extract_answer(response.json())
            if not answer.strip():
                bot.reply_to(message, "El modelo devolvió una respuesta vacía.")
                return
            user_history[user_id]["messages"].append({"role": "user", "content": f"[imagen adjunta: {caption}]"})
            user_history[user_id]["messages"].append({"role": "assistant", "content": answer})
            if len(answer) > 4000:
                for i in range(0, len(answer), 4000):
                    bot.send_message(message.chat.id, answer[i:i+4000], parse_mode='Markdown')
            else:
                bot.reply_to(message, answer, parse_mode='Markdown')
        else:
            logging.error(f"Error Open WebUI imagen ({response.status_code}): {response.text[:300]}")
            bot.reply_to(message, "Lo siento, hubo un problema al procesar la imagen.")

    except Exception as e:
        logging.exception("Error procesando imagen")
        bot.reply_to(message, f"Ocurrió un error inesperado: {str(e)}")

@bot.message_handler(content_types=['document'])
def handle_document(message):
    # Extrae el texto del PDF con PyMuPDF y lo inyecta como contexto al modelo.
    # Se trunca a 12.000 caracteres para no superar el contexto del modelo.
    if ALLOWED_USERS is not None and message.from_user.id not in ALLOWED_USERS:
        return
    user_id = message.from_user.id

    if not message.document.mime_type == 'application/pdf':
        bot.reply_to(message, "Solo se admiten documentos PDF.")
        return

    if user_id not in user_history:
        user_history[user_id] = {"messages": []}

    bot.send_message(message.chat.id, "📄 Documento recibido, espere por favor...")
    bot.send_chat_action(message.chat.id, 'typing')

    try:
        file_info = bot.get_file(message.document.file_id)
        downloaded = bot.download_file(file_info.file_path)

        pdf = fitz.open(stream=downloaded, filetype="pdf")
        text = "\n".join(page.get_text() for page in pdf)
        pdf.close()

        if not text.strip():
            bot.reply_to(message, "No se pudo extraer texto del PDF. Puede estar escaneado o protegido.")
            return

        MAX_CHARS = 12000
        if len(text) > MAX_CHARS:
            text = text[:MAX_CHARS] + "\n\n[Documento truncado por longitud]"

        caption = message.caption or "Resume este documento."
        enriched = f"Contenido del documento PDF:\n\n{text}\n\nInstrucción: {caption}"
        messages_pdf = [
            {"role": "system", "content": "Eres un asistente que analiza documentos. Responde ÚNICAMENTE basándote en el contenido del documento proporcionado. No menciones ni hagas referencia a ningún otro contexto o instrucción previa."},
            {"role": "user", "content": enriched}
        ]

        headers = {"Authorization": f"Bearer {OPENWEBUI_API_KEY}", "Content-Type": "application/json"}
        payload = {"model": MODEL_ID, "messages": messages_pdf, "stream": False}
        response = requests.post(OPENWEBUI_URL, headers=headers, json=payload, timeout=60)

        if response.status_code == 200:
            answer = extract_answer(response.json())
            if not answer.strip():
                bot.reply_to(message, "El modelo devolvió una respuesta vacía.")
                return
            user_history[user_id]["messages"].append({"role": "user", "content": f"[documento PDF: {caption}]"})
            user_history[user_id]["messages"].append({"role": "assistant", "content": answer})
            if len(answer) > 4000:
                for i in range(0, len(answer), 4000):
                    bot.send_message(message.chat.id, answer[i:i+4000], parse_mode='Markdown', reply_markup=main_keyboard())
            else:
                bot.send_message(message.chat.id, answer, parse_mode='Markdown', reply_markup=main_keyboard())
        else:
            bot.reply_to(message, "Error al procesar el documento.")

    except Exception as e:
        logging.exception("Error procesando PDF")
        bot.reply_to(message, f"Error inesperado: {str(e)}")


# --- Handler de botones inline ---

@bot.callback_query_handler(func=lambda call: call.data in ["web_search", "cancel_search", "clear_memory", "confirm_clear", "cancel_clear"])
def handle_callbacks(call):
    # gestiona los botones inline: búsqueda web, cancelar búsqueda y borrar memoria.
    user_id = call.from_user.id
    bot.answer_callback_query(call.id)

    if call.data == "web_search":
        web_mode_users.add(user_id)
        bot.send_message(call.message.chat.id, "¿Qué quieres buscar?", reply_markup=web_keyboard())

    elif call.data == "cancel_search":
        web_mode_users.discard(user_id)
        bot.edit_message_reply_markup(call.message.chat.id, call.message.message_id, reply_markup=None)
        bot.send_message(call.message.chat.id, "Búsqueda cancelada.", reply_markup=main_keyboard())

    elif call.data == "clear_memory":
        markup = telebot.types.InlineKeyboardMarkup()
        markup.row(
            telebot.types.InlineKeyboardButton("✅ Confirmar", callback_data="confirm_clear"),
            telebot.types.InlineKeyboardButton("❌ Cancelar", callback_data="cancel_clear")
        )
        bot.send_message(call.message.chat.id, "⚠️ Se borrará toda la memoria de esta conversación. El asistente no recordará nada de lo hablado.\n\n¿Confirmas?", reply_markup=markup)

    elif call.data == "confirm_clear":
        user_history[user_id] = {"messages": []}
        web_mode_users.discard(user_id)
        bot.edit_message_text("🗑️ Memoria borrada.", call.message.chat.id, call.message.message_id)

    elif call.data == "cancel_clear":
        bot.edit_message_text("Cancelado. La memoria se conserva.", call.message.chat.id, call.message.message_id)


# --- Handler principal de mensajes de texto ---

@bot.message_handler(func=lambda message: True)
def handle_message(message):
    # Punto de entrada para todos los mensajes de texto.
    # Si el usuario está en modo búsqueda web o usa el prefijo "web ", se enriquece
    # el prompt con resultados de DuckDuckGo antes de enviarlo al modelo.
    if ALLOWED_USERS is not None and message.from_user.id not in ALLOWED_USERS:
        uid = message.from_user.id
        attempt = unauthorized_attempts.get(uid, 0)
        unauthorized_attempts[uid] = attempt + 1
        if attempt < len(UNAUTHORIZED_MESSAGES):
            bot.reply_to(message, UNAUTHORIZED_MESSAGES[attempt])
        return

    user_id = message.from_user.id
    user_input = message.text

    if user_id not in user_history:
        user_history[user_id] = {"messages": []}

    # Detectar si el usuario quiere búsqueda web (botón o prefijo de texto)
    extra_system = None
    if user_id in web_mode_users:
        web_mode_users.discard(user_id)
        bot.send_chat_action(message.chat.id, 'typing')
        extra_system = search_web(user_input)
    elif user_input.lower().startswith(WEB_PREFIX):
        query = user_input[len(WEB_PREFIX):].strip()
        user_input = query
        bot.send_chat_action(message.chat.id, 'typing')
        extra_system = search_web(query)

    if extra_system:
        enriched_content = f"Usa los siguientes resultados de búsqueda web para responder:\n\n{extra_system}\n\nPregunta: {user_input}"
        user_history[user_id]["messages"].append({"role": "user", "content": enriched_content})
    else:
        user_history[user_id]["messages"].append({"role": "user", "content": user_input})

    try:
        bot.send_chat_action(message.chat.id, 'typing')

        headers = {"Authorization": f"Bearer {OPENWEBUI_API_KEY}", "Content-Type": "application/json"}
        # Solo los últimos 10 mensajes para no superar el contexto del modelo
        messages = user_history[user_id]["messages"][-10:]

        logging.info(f"Enviando consulta a Open WebUI para el usuario {user_id}...")
        messages_with_system = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
        answer = call_openwebui(messages_with_system, headers)

        if answer is None:
            bot.reply_to(message, "Lo siento, hubo un problema al conectar con Open WebUI.")
            return

        if not answer.strip():
            bot.reply_to(message, "El modelo devolvió una respuesta vacía. Intenta reformular la consulta.")
            return

        user_history[user_id]["messages"].append({"role": "assistant", "content": answer})

        # Telegram tiene límite de 4096 caracteres por mensaje
        if len(answer) > 4000:
            for i in range(0, len(answer), 4000):
                chunk = answer[i:i+4000]
                try:
                    bot.send_message(message.chat.id, chunk, parse_mode='Markdown')
                except Exception:
                    bot.send_message(message.chat.id, chunk)
        else:
            try:
                bot.send_message(message.chat.id, answer, parse_mode='Markdown', reply_markup=main_keyboard())
            except Exception:
                bot.send_message(message.chat.id, answer, reply_markup=main_keyboard())

    except Exception as e:
        logging.exception("Error procesando mensaje")
        bot.reply_to(message, f"Ocurrió un error inesperado: {str(e)}")


if __name__ == "__main__":
    logging.info(f"Iniciando bot de Telegram para el modelo '{MODEL_ID}'...")
    bot.infinity_polling()
