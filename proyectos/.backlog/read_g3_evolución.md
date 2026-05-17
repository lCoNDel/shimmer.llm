# READ G3 — IDEA Y OPCIONES DE EVOLUCIÓN
Shimmer LLM / Touron S.A.
Mayo 2026

---

## 1. Qué es

`read_g3` es una tool Python desarrollada para Open WebUI que lee archivos CSV
exportados por el software de diagnóstico Mercury PCM (G3 Diagnostic Tool).

**Funcionalidad actual:**
- Detecta automáticamente el delimitador del CSV (coma, punto y coma, tabulador, pipe)
- Escanea todas las filas buscando fallos activos en las columnas `ActiveFaultMarqueeDisp` y `GuardianCause`
- Sin filtro: devuelve 3 filas de muestra + resumen de fallos detectados con número de ocurrencias por código
- Con filtro: devuelve hasta 10 filas que contengan el valor buscado en cualquier columna
- Output: JSON estructurado listo para que el LLM lo interprete

El técnico adjunta el CSV exportado del G3, la tool procesa el archivo en segundos y devuelve los códigos de error activos. A continuación, el agente busca cada código en el RAG (manual Mercury completo) y genera la explicación detallada.

---

## 2. Flujo actual

```
CSV exportado del G3
      ↓
read_g3() — detecta códigos de fallo
      ↓
[intervención manual del usuario]
      ↓
Búsqueda RAG sobre el manual Mercury
      ↓
Explicación del fallo + acción recomendada
```

**Problema:** dos pasos manuales que el técnico tiene que encadenar a mano.
El diagnóstico completo requiere que el usuario pida expresamente la búsqueda
en el manual tras ver los códigos detectados.

---

## 3. Opciones de evolución

### Opción A — Automatizar vía system prompt del agente (coste: mínimo)

Modificar el skill `diagnostico-motores` para que el agente, tras ejecutar
`read_g3`, busque automáticamente en el RAG cada código detectado sin esperar
confirmación del usuario.

- Sin tocar código Python. Solo cambio en el SKILL.md del agente.
- Implementable hoy mismo.
- **Limitación:** depende de que el LLM respete la instrucción del system prompt en cada llamada. No garantizado al 100%.

---

### Opción B — Tool unificada con RAG interno (coste: medio)

`read_g3` detecta los códigos y, antes de devolver el resultado, lanza
automáticamente las consultas al RAG por cada código encontrado. El output
final incluye tanto los códigos como sus explicaciones en un solo paso.

- **Ventaja:** flujo completamente automático, un solo mensaje del técnico.
- **Inconveniente:** acopla la tool a la infraestructura de Shimmer (ChromaDB, Open WebUI). Más complejo de mantener.

---

### Opción C — Diccionario de códigos embebido (coste: medio-alto, valor alto)

Incorporar el mapeado completo del manual Mercury directamente en la tool
como diccionario Python (`FAULT_CODES`). Cada entrada incluiría:
- Descripción del fallo
- Gravedad (informativa / advertencia / crítica)
- Acción recomendada
- Referencia de pieza afectada si aplica

La tool pasaría a ser completamente autónoma, sin depender del RAG para
interpretar los códigos. El RAG quedaría como capa adicional para preguntas
abiertas sobre el manual.

- **Ventaja:** tool portable, exportable, ejecutable fuera de Shimmer.
- Base necesaria para cualquier exposición externa del servicio.

---

### Opción D — Exposición como servicio externo (coste: alto, valor estratégico)

Envolver la lógica de `read_g3` en una API FastAPI con un endpoint REST simple:

```
POST /diagnostico
Body: archivo CSV
Response: JSON con fallos detectados + explicaciones
```

Sobre esa API, una interfaz web mínima (formulario de subida + resultado)
accesible para talleres y concesionarios de la red Touron sin necesidad de
acceder a Shimmer.

- **Modelo:** gratuito para la red de talleres Mercury/Quicksilver.
- **Valor para Touron:** diferenciación como distribuidor, fidelización de talleres, posicionamiento ante Brunswick como partner técnico activo.
- **Requisito previo:** tener la Opción C implementada (tool autónoma sin RAG).

---

## 4. Hoja de ruta recomendada

| Plazo | Opción | Descripción |
|---|---|---|
| Corto | A | Automatizar el agente interno, sin código nuevo |
| Medio | C | Diccionario de códigos embebido, tool autónoma |
| Largo | D | Servicio externo para red de talleres |

La Opción B puede descartarse si se implementa C, ya que C hace la tool
independiente del RAG para la interpretación de códigos básicos.

---

## 5. Estado actual en el backlog Shimmer

| Elemento | Estado |
|---|---|
| `diagnosis_motores` | Pendiente de desarrollo formal |
| `read_g3` | Tool funcional en producción (Open WebUI) |
| RAG manual Mercury | Activo (manuales públicos, embedding `text-embedding-3-large` Azure OpenAI) |
| Skill `diagnostico-motores` | Pendiente de definir/completar |

---

*Documento interno Shimmer LLM — Touron S.A. No distribuir fuera del equipo IT.*
