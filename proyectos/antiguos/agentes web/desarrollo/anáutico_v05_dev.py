import openai
import os

# API
openai.api_key = os.environ.get('API_NAUTICO')

# Presentación del asistente
ASSISTANT_DESCRIPTION = (
    "Eres Shimmer, un asistente náutico en fase de pruebas diseñado por Luis Conde y representante de Touron S.A. "
    "Estás especializado en navegación marítima, meteorología, rutas, consejos de seguridad en el mar y orientación técnica. "
    "Proporciona respuestas claras y detalladas, utilizando un enfoque paso a paso cuando sea necesario."
)

# Información de contacto
CONTACT_INFO = (
    "📞 Teléfono: 916 57 27 73\n"
    "📧 Correo Electrónico: touron@touronsa.es\n"
    "🌐 Página Web: www.touron.es"
)

# Productos distribuidos
PRODUCTS = {
    "Motores": [
        "Mercury", "Mercury Avator", "Mercury Mercruiser",
        "Mercury Diesel", "MotorGuide", "Cummins", "Cummins Onan",
        "Quicksilver"
    ],
    "Embarcaciones": ["Navan", "Hayday", "Bayliner"],
    "Accesorios": [
        "Touron", "Attwood", "Land N Sea", "Talamex", "Seachoice", "Besto",
        "OneUP"
    ]
}

# Funciones especiales del asistente
SPECIAL_FUNCTIONS = [
    "Consumo de Combustible", "Conversión de Velocidades",
    "Tiempo de Viaje", "Conversión de Distancias",
    "Distancia entre Puertos", "Velocidad Promedio",
    "Consumo por Distancia", "Efecto de Corriente",
    "Nueva Posición del Barco", "Capacidad de Carga"
]

def chat_with_gpt(prompt, user):
    """
    Función para interactuar con GPT y generar respuestas.
    Describe el propósito del asistente, la información de contacto, productos y funciones especiales relacionadas con Touron.
    """
    try:
        # Construir el mensaje sistemático
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Modelo
            messages=[{
                "role": "system",
                "content": (
                    f"{ASSISTANT_DESCRIPTION}\n\n"
                    "Información de contacto de Touron S.A.:\n"
                    f"{CONTACT_INFO}\n\n"
                    "Marcas de productos distribuidos por Touron:\n"
                    f"Motores: {', '.join(PRODUCTS['Motores'])}\n"
                    f"Embarcaciones: {', '.join(PRODUCTS['Embarcaciones'])}\n"
                    f"Accesorios: {', '.join(PRODUCTS['Accesorios'])}\n\n"
                    "Funciones especiales disponibles:\n"
                    f"{', '.join(SPECIAL_FUNCTIONS)}."
                )
            }, {
                "role": "user",
                "content": prompt
            }])
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error al procesar tu solicitud: {str(e)}"

if __name__ == "__main__":
    import random

    # Variaciones de presentaciones
    introductions = [
        "🌊 Bienvenido a bordo, soy Shimmer, tu asistente náutico de Touron S.A. 🌊 ¿Cómo puedo ayudarte hoy?",
        "🌟 ¡Hola navegante! Soy Shimmer, el experto de Touron S.A. en navegación marítima. 🌟 ¿En qué puedo asistirte?",
        "⚓ Soy Shimmer, tu aliado náutico de Touron S.A. 🚤 ¡Pregúntame lo que necesites para tu próxima aventura!",
        "⛵ Bienvenido, soy Shimmer, el asistente náutico de Touron S.A., listo para resolver todas tus dudas marítimas. 🌊"
    ]

    # Presentación inicial del asistente
    print(random.choice(introductions))

    # Lista de usuarios autenticados
    authenticated_users = [
        "CMartin", "FGiquel", "AGiquel", "CGiquel", "Victor Páez"
    ]

    while True:
        # Solicitar entrada del usuario
        user_input = input("\nTú: ")

        # Verificar si el usuario está autenticado
        user = user_input.strip()  # Simulación de la entrada del usuario
        if user in authenticated_users:
            print(f"Shimmer: ¡A su servicio, Don {user}! ¿Cómo puedo ayudarle hoy?")

        # Obtener y mostrar la respuesta del asistente
        response = chat_with_gpt(user_input, user)
        print("\nShimmer: ", response)
