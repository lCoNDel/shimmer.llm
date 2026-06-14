# Changelog — 2026-05-11

## bot — Actualización del equipo en el system prompt del Asistente Náutico

### Cambios realizados

Revisión completa de la sección `## Equipo` del `SYSTEM_PROMPT` en `asistente_nautico.py`, con los siguientes objetivos:

1. **Corregir ambigüedad de roles** — el agente confundía a Luis Conde con el Director de Sistemas por la repetición del término "Sistemas". Se consolidó toda la info de Luis en una sola entrada.
2. **Estandarizar el formato** — Director/Directora pasa a ir delante del nombre en todos los departamentos (`Director: Nombre` en lugar de `Nombre (Director)`), para que el agente identifique claramente quién dirige cada área.
3. **Añadir roles explícitos** — todos los empleados tienen ahora su rol entre paréntesis. Antes muchos aparecían sin rol o agrupados bajo etiquetas genéricas.
4. **Apellidos completos** — se completaron los apellidos usando la web oficial `touron.es/sobre-nosotros`.
5. **Separador unificado a `·`** — se eliminaron todas las comas como separador entre personas; el `·` evita ambigüedad con las comas internas de los paréntesis de roles.
6. **Altas y bajas de personal:**
   - Rafael Baretta → baja (sustituido por Rafael Pérez Rodrigo en Atención al Cliente de Repuesto & Accesorio)
   - Pablo Zorzo → baja (SAT)
   - Logística ampliada con todos sus operarios de almacén (7 personas nuevas)
   - Rubén Sánchez → pasa a Atención al Cliente en Repuesto & Accesorio (retirado de Operario de Almacén)

### Roles actualizados por departamento

| Departamento | Cambio principal |
|---|---|
| Sistemas | Luis Conde: `Técnico IT / Soporte G3 Mercury`; resto: `Técnico Oracle/Big Data/M365` |
| SAT | Ángel García y José Machado: `Asesor de Servicio`; Pablo Zorzo eliminado |
| Repuesto & Accesorio | Rafael Baretta → Rafael Pérez Rodrigo (Atención al Cliente) |
| Logística | 7 nuevos Operarios de Almacén añadidos con nombre completo |
| Marketing | Roles detallados: Diseño Gráfico & Redes Sociales, Técnico de Marketing |
| Finanzas & Admin | Roles detallados: Contable, Responsable de Personas, Office Manager & Recepcionista |

---

## Contexto técnico para agentes

**Archivo modificado:** `.docker/.bots/telegram/asistente_nautico.py` — sección `SYSTEM_PROMPT`, líneas 83–99

**Criterio de separador:** se usa `·` (punto medio Unicode) entre personas del mismo departamento. Las comas solo aparecen dentro de paréntesis de roles compuestos. No mezclar separadores.

**Criterio de Director:** el formato es `Director: Nombre Apellido` (sin paréntesis), siempre al inicio de la línea del departamento. El resto de empleados llevan `Nombre Apellido (Rol)`.

**Por qué se cambió el rol de Luis Conde:** antes aparecía como `Luis Conde (Sistemas)` y al final de la línea `Soporte G3 Mercury: Luis Conde`, lo que causaba que el agente lo identificara como Director del área en algunos contextos. El nuevo formato `Luis Conde (Técnico IT / Soporte G3 Mercury)` es inequívoco.
