import telebot
import requests
import json
import logging
import base64
import fitz
from ddgs import DDGS

# Configuración básica de logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Credenciales y Configuración
TELEGRAM_TOKEN = "8633157162:AAFdIrMs-3jROMEb8jrIQUvi5vHFTUzLKaw"
OPENWEBUI_API_KEY = "sk-86be5033063c4e1488007be92f4b2196"
OPENWEBUI_URL = "http://host.docker.internal:3000/api/chat/completions"
MODEL_ID = "asistente-touron"

ALLOWED_USERS = None  # None = acceso abierto a todos
WEB_PREFIX = "/web "

def extract_answer(response_json: dict) -> str:
    try:
        content = response_json['choices'][0]['message']['content']
        if not content:
            logging.warning(f"content vacío. Respuesta completa: {json.dumps(response_json, ensure_ascii=False)[:500]}")
        return content or ""
    except (KeyError, IndexError, TypeError) as e:
        logging.warning(f"extract_answer falló: {e}. JSON: {json.dumps(response_json, ensure_ascii=False)[:500]}")
        return ""

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

UNAUTHORIZED_MESSAGES = [
    "Lo lamento pero no está usted autorizado para utilizar el agente, puede solicitar acceso a @CBLuiSo.",
    "Le digo que no está usted autorizado, vaya a dar un paseo, que corra el aire.",
    "Eres imbécil?",
    "Eso responde a mi pregunta, gracias.",
    "Chat Finalizado.",
]

unauthorized_attempts = {}

bot = telebot.TeleBot(TELEGRAM_TOKEN)

# Historial por usuario
user_history = {}

# Usuarios en modo búsqueda web (esperando consulta tras pulsar el botón)
web_mode_users = set()

def main_keyboard():
    markup = telebot.types.InlineKeyboardMarkup()
    markup.row(
        telebot.types.InlineKeyboardButton("🌐 Búsqueda Web", callback_data="web_search"),
        telebot.types.InlineKeyboardButton("🗑️ Borrar Memoria", callback_data="clear_memory")
    )
    return markup

def web_keyboard():
    markup = telebot.types.InlineKeyboardMarkup()
    markup.row(telebot.types.InlineKeyboardButton("❌ Cancelar Búsqueda", callback_data="cancel_search"))
    return markup

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    if ALLOWED_USERS is not None and message.from_user.id not in ALLOWED_USERS:
        return
    bot.send_message(message.chat.id, "Shimmer Iniciado.", reply_markup=telebot.types.ReplyKeyboardRemove())

@bot.message_handler(commands=['web'])
def handle_web_command(message):
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
    logging.info(f"Búsqueda web para '{query}': {len(search_results)} chars de resultados\n{search_results}")

    enriched_content = f"Usa los siguientes resultados de búsqueda web para responder:\n\n{search_results}\n\nPregunta: {query}"
    user_history[user_id]["messages"].append({"role": "user", "content": enriched_content})

    try:
        headers = {"Authorization": f"Bearer {OPENWEBUI_API_KEY}", "Content-Type": "application/json"}
        messages = user_history[user_id]["messages"][-10:]
        payload = {"model": MODEL_ID, "messages": messages, "stream": False}
        logging.info(f"Enviando /web a Open WebUI con {len(messages)} mensajes")

        response = requests.post(OPENWEBUI_URL, headers=headers, json=payload, timeout=120)

        if response.status_code == 200:
            answer = extract_answer(response.json())
            logging.info(f"Respuesta Open WebUI para /web: '{answer[:100]}'")
            user_history[user_id]["messages"].append({"role": "assistant", "content": answer})
            if not answer.strip():
                bot.reply_to(message, "El modelo devolvió una respuesta vacía. Intenta reformular la consulta.")
                return
            if len(answer) > 4000:
                for i in range(0, len(answer), 4000):
                    bot.send_message(message.chat.id, answer[i:i+4000])
            else:
                bot.reply_to(message, answer)
        else:
            logging.error(f"Error Open WebUI ({response.status_code}): {response.text}")
            bot.reply_to(message, "Lo siento, hubo un problema al conectar con Open WebUI.")
    except Exception as e:
        logging.exception("Error en /web")
        bot.reply_to(message, f"Ocurrió un error inesperado: {str(e)}")

@bot.message_handler(commands=['newchat'])
def reset_history(message):
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

@bot.message_handler(content_types=['photo'])
def handle_photo(message):
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

    caption = message.caption or "Describe esta imagen."

    bot.send_message(message.chat.id, "🖼️ Imagen recibida, espere por favor...")
    bot.send_chat_action(message.chat.id, 'typing')

    try:
        file_info = bot.get_file(message.photo[-1].file_id)
        downloaded = bot.download_file(file_info.file_path)
        image_b64 = base64.b64encode(downloaded).decode("utf-8")

        image_message = {
            "role": "user",
            "content": [
                {"type": "text", "text": caption},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
            ]
        }

        headers = {"Authorization": f"Bearer {OPENWEBUI_API_KEY}", "Content-Type": "application/json"}
        payload = {"model": MODEL_ID, "messages": [image_message], "stream": False}
        response = requests.post(OPENWEBUI_URL, headers=headers, json=payload, timeout=120)

        if response.status_code == 200:
            answer = extract_answer(response.json())
            if not answer.strip():
                bot.reply_to(message, "El modelo devolvió una respuesta vacía.")
                return
            user_history[user_id]["messages"].append({"role": "user", "content": f"[imagen adjunta: {caption}]"})
            user_history[user_id]["messages"].append({"role": "assistant", "content": answer})
            if len(answer) > 4000:
                for i in range(0, len(answer), 4000):
                    bot.send_message(message.chat.id, answer[i:i+4000])
            else:
                bot.reply_to(message, answer)
        else:
            logging.error(f"Error Open WebUI ({response.status_code}): {response.text}")
            bot.reply_to(message, "Lo siento, hubo un problema al procesar la imagen.")

    except Exception as e:
        logging.exception("Error procesando imagen")
        bot.reply_to(message, f"Ocurrió un error inesperado: {str(e)}")


@bot.message_handler(content_types=['document'])
def handle_document(message):
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
        response = requests.post(OPENWEBUI_URL, headers=headers, json=payload, timeout=120)

        if response.status_code == 200:
            answer = extract_answer(response.json())
            if not answer.strip():
                bot.reply_to(message, "El modelo devolvió una respuesta vacía.")
                return
            user_history[user_id]["messages"].append({"role": "user", "content": f"[documento PDF: {caption}]"})
            user_history[user_id]["messages"].append({"role": "assistant", "content": answer})
            if len(answer) > 4000:
                for i in range(0, len(answer), 4000):
                    bot.send_message(message.chat.id, answer[i:i+4000], reply_markup=main_keyboard())
            else:
                bot.send_message(message.chat.id, answer, reply_markup=main_keyboard())
        else:
            bot.reply_to(message, "Error al procesar el documento.")

    except Exception as e:
        logging.exception("Error procesando PDF")
        bot.reply_to(message, f"Error inesperado: {str(e)}")

@bot.callback_query_handler(func=lambda call: call.data in ["web_search", "cancel_search", "clear_memory", "confirm_clear", "cancel_clear"])
def handle_callbacks(call):
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

@bot.message_handler(func=lambda message: True)
def handle_message(message):
    if ALLOWED_USERS is not None and message.from_user.id not in ALLOWED_USERS:
        uid = message.from_user.id
        attempt = unauthorized_attempts.get(uid, 0)
        unauthorized_attempts[uid] = attempt + 1
        if attempt < len(UNAUTHORIZED_MESSAGES):
            bot.reply_to(message, UNAUTHORIZED_MESSAGES[attempt])
        return
    user_id = message.from_user.id
    user_input = message.text


    # Inicializar historial si no existe
    if user_id not in user_history:
        user_history[user_id] = {"messages": []}

    # Detectar modo búsqueda web (botón) o prefijo /web
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
        messages = user_history[user_id]["messages"][-10:]
        payload = {"model": MODEL_ID, "messages": messages, "stream": False}

        logging.info(f"Enviando consulta a Open WebUI para el usuario {user_id}...")
        response = requests.post(OPENWEBUI_URL, headers=headers, json=payload, timeout=120)

        if response.status_code == 200:
            answer = extract_answer(response.json())

            if not answer.strip():
                bot.reply_to(message, "El modelo devolvió una respuesta vacía. Intenta reformular la consulta.")
                return

            user_history[user_id]["messages"].append({"role": "assistant", "content": answer})

            if len(answer) > 4000:
                for i in range(0, len(answer), 4000):
                    bot.send_message(message.chat.id, answer[i:i+4000])
            else:
                bot.send_message(message.chat.id, answer, reply_markup=main_keyboard())
        else:
            logging.error(f"Error Open WebUI ({response.status_code}): {response.text}")
            bot.reply_to(message, "Lo siento, hubo un problema al conectar con Open WebUI.")

    except Exception as e:
        logging.exception("Error procesando mensaje")
        bot.reply_to(message, f"Ocurrió un error inesperado: {str(e)}")

if __name__ == "__main__":
    logging.info(f"Iniciando bot de Telegram para el modelo '{MODEL_ID}'...")
    bot.infinity_polling()
