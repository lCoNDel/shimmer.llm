# SOP-001: Generación de Web Estática
**Objective**: Generar un archivo `index.html` minimalista con contenido sobre capacidades de Antigravity.

## 1. Inputs
*   **Titulo**: "Antigravity Skill Demo"
*   **Contenido**: Texto generado (< 10 words) sobre capacidades de Antigravity.
*   **Estilo**: HTML puro, sin CSS externo ni interno complejo (según regla "Texto plano").

## 2. Logic (Python Tool)
1.  Definir el contenido de texto (hardcoded o generado determinísticamente).
2.  Construir la estructura HTML5 básica.
3.  Insertar título y contenido en el body.
4.  Guardar el archivo en `.tmp/index.html` primero (Fase 3).
5.  Mover a `index.html` raíz (Fase 5 - Trigger/Payload).

## 3. Edge Cases
*   **Length Check**: Si el contenido supera 100 palabras, truncar.
*   **Encoding**: Asegurar UTF-8 para caracteres especiales.

## 4. Output
*   Archivo físico: `index.html`
