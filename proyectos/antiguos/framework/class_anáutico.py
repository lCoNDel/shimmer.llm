import openai
import os

# Configuración de la API de OpenAI


def chat_with_gpt(prompt):
    """
    Función Interactuar.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Modelo
            messages=[{
                "role":
                "system",
                "content":
                ("Eres un asistente náutico experto, especializado en navegación marítima,                     "
                 "meteorología marina, rutas, consejos de seguridad en el mar y                                 orientación técnica."
                 )
            }, {
                "role": "user",
                "content": prompt
            }])
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error al procesar tu solicitud: {str(e)}"


if __name__ == "__main__":
    print("🌊 Bienvenido al Asistente Náutico 🌊")
    print(
        "Puedes hacerme consultas sobre navegación, meteorología marina, rutas, y más."
    )
    print("Escribe 'quit', 'exit' o 'bye' para salir.")

    while True:
        # Solicitar entrada del usuario
        user_input = input("\nTú: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            print("🌊 ¡Buen viento y buena mar! 🌊")
            break

        # Obtener y mostrar la respuesta del asistente
        response = chat_with_gpt(user_input)
        print("\nAsistente Náutico: ", response)
