import os

# Deterministic Content
TITLE = "Antigravity Skill Demo"
CONTENT = """
Antigravity permite automatización determinista mediante el protocolo B.L.A.S.T.
Sus capacidades incluyen:
1. Blueprint: Planificación estructurada.
2. Link: Verificación de conexiones.
3. Architect: Lógica separada en 3 capas.
4. Stylize: Entrega profesional.
5. Trigger: Ejecución fiable.
Priorizamos la fiabilidad sobre la velocidad.
"""

def generate_index():
    # 1. Validate content length
    word_count = len(CONTENT.split())
    if word_count > 100:
        raise ValueError(f"Content exceeds 100 words: {word_count}")

    # 2. Build HTML
    html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{TITLE}</title>
</head>
<body>
    <h1>{TITLE}</h1>
    <pre>{CONTENT.strip()}</pre>
</body>
</html>"""

    # 3. Write to .tmp (Workbench)
    tmp_path = ".tmp/index.html"
    os.makedirs(".tmp", exist_ok=True)
    
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"Attributes generated in {tmp_path}")
    print(f"Word count: {word_count}")

if __name__ == "__main__":
    generate_index()
