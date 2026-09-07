---
name: creador-habilidades
description: Asiste al usuario en la creación de nuevas habilidades para Claude. Utiliza esta habilidad cuando necesites estructurar, documentar o definir una nueva capacidad para el agente en este espacio de trabajo.
---

# Creador de Habilidades

Esta habilidad te guía a través del proceso de creación de nuevas habilidades modulares y efectivas para Antigravity.

## Flujo de Trabajo

Cuando se te pida crear una nueva habilidad, sigue estos pasos:

1.  **Investigación y Definición**:
    *   Pregunta al usuario por el objetivo principal de la nueva habilidad.
    *   Determina un `name` (identificador único) y una `description` clara.
    *   Identifica si la habilidad requiere scripts de apoyo o archivos adicionales.

2.  **Estructura de Carpetas**:
    *   Crea el directorio en: `C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\.agents\skills\[nombre-de-la-habilidad]/`.

3.  **Creación del archivo SKILL.md**:
    *   Define el **Frontmatter**:
        ```markdown
        ---
        name: [identificador-unico]
        description: [Explicación detallada de QUÉ hace y CUÁNDO usarla]
        ---
        ```
    *   Escribe las **Instrucciones**:
        *   Usa encabezados de Markdown para organizar los pasos.
        *   Incluye listas de verificación (checklists) para asegurar la calidad.
        *   Proporciona ejemplos de cómo debe actuar el agente al usar la habilidad.

4.  **Validación**:
    *   Verifica que la descripción en el frontmatter sea lo suficientemente específica para que el agente sepa cuándo invocarla.
    *   Asegúrate de que las instrucciones sean claras y sigan las mejores prácticas (enfoque único, scripts como cajas negras si es necesario).

## Mejores Prácticas

*   **Foco Único**: Cada habilidad debe hacer una sola cosa extremadamente bien.
*   **Descripción Crítica**: La descripción es lo que permite al agente elegir la habilidad correcta de forma autónoma.
*   **Instrucciones Accionables**: Usa imperativos y pasos numerados para guiar al agente.
*   **Idioma**: Mantén las instrucciones en el idioma solicitado por el usuario (en este caso, español).
