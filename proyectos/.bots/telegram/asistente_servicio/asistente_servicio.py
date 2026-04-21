import telebot
import requests
import json
import logging
import time

# Configuración básica de logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Credenciales y Configuración
TELEGRAM_TOKEN = ""
OPENWEBUI_API_KEY = ""
OPENWEBUI_URL = "http://host.docker.internal:3000/api/chat/completions"
MODEL_ID = ""

bot = telebot.TeleBot(TELEGRAM_TOKEN)

# Diccionario para mantener un historial y timestamp por usuario
user_history = {}
TIMEOUT_MINUTES = 10

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    pass

@bot.message_handler(commands=['newchat'])
def reset_history(message):
    user_id = message.from_user.id
    user_history[user_id] = {"timestamp": time.time(), "messages": []}
    bot.reply_to(message, "Conversación reiniciada. Se ha limpiado el historial local.")

@bot.message_handler(func=lambda message: True)
def handle_message(message):
    user_id = message.from_user.id
    user_input = message.text
    current_time = time.time()

    # Inicializar historial si no existe o si pasó el timeout
    if user_id not in user_history:
        user_history[user_id] = {"timestamp": current_time, "messages": []}
    else:
        last_time = user_history[user_id]["timestamp"]
        if (current_time - last_time) > (TIMEOUT_MINUTES * 60):
            logging.info(f"Limpiando historial por inactividad para {user_id}")
            user_history[user_id] = {"timestamp": current_time, "messages": []}
            bot.reply_to(message, "⏳ La sesión ha caducado, un nuevo chat comenzará en breves.")

    # Actualizar timestamp
    user_history[user_id]["timestamp"] = current_time

    # Añadir mensaje del usuario al historial
    user_history[user_id]["messages"].append({"role": "user", "content": user_input})

    try:
        # Mostrar que el bot está "escribiendo"
        bot.send_chat_action(message.chat.id, 'typing')

        headers = {
            "Authorization": f"Bearer {OPENWEBUI_API_KEY}",
            "Content-Type": "application/json"
        }

        # Enviar los últimos 10 mensajes para mantener contexto
        payload = {
            "model": MODEL_ID,
            "messages": user_history[user_id]["messages"][-10:],
            "stream": False
        }

        logging.info(f"Enviando consulta a Open WebUI para el usuario {user_id}...")
        response = requests.post(OPENWEBUI_URL, headers=headers, json=payload, timeout=120)

        if response.status_code == 200:
            result = response.json()
            answer = result['choices'][0]['message']['content']

            # Guardar respuesta en el historial
            user_history[user_id]["messages"].append({"role": "assistant", "content": answer})

            # Enviar respuesta al usuario de Telegram (manejando límites de caracteres de Telegram)
            if len(answer) > 4000:
                for i in range(0, len(answer), 4000):
                    bot.send_message(message.chat.id, answer[i:i+4000])
            else:
                bot.reply_to(message, answer)
        else:
            error_msg = f"Error de Open WebUI ({response.status_code}): {response.text}"
            logging.error(error_msg)
            bot.reply_to(message, "Lo siento, hubo un problema al conectar con Open WebUI.")

    except Exception as e:
        logging.exception("Error procesando mensaje")
        bot.reply_to(message, f"Ocurrió un error inesperado: {str(e)}")

if __name__ == "__main__":
    logging.info(f"Iniciando bot de Telegram para el modelo '{MODEL_ID}'...")
    bot.infinity_polling()
