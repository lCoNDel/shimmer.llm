# Framework Base

import openai
import os



def chat_with_gpt(prompt):
    response = openai.chat.completions.create(
        model="gpt-4o-mini", # código open ai para el bot
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break

        response = chat_with_gpt(user_input)
        print("Chatbot: ", response)

