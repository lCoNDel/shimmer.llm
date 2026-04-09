# Contexto de sesión — Continuación en otra máquina
**Fecha:** Abril 2026  
**Proyecto:** Propuesta técnica formal — Plataforma IA Shimmer LLM para Touron S.A.

---

## Archivo de trabajo principal

Todo el contenido ha sido consolidado en un único archivo:

```
proyectos/.personal/Plataforma LLM ' RAG/PROPUESTA_COMPLETA.html
```

Es un HTML autónomo (CSS inline, sin dependencias externas) que contiene todas las secciones en un único documento paginado. Se abre en Chrome/Edge y se exporta a PDF con `Ctrl+P → Guardar como PDF` (activar "Gráficos de fondo").

Los archivos HTML individuales por sección siguen existiendo pero **el documento de trabajo es PROPUESTA_COMPLETA.html**.

---

## Propósito del documento

Luis Conde trabaja en Touron S.A. como Técnico de Sistemas (8 años en la empresa). Ha desarrollado internamente la plataforma de IA **Shimmer LLM** y necesita presentarla formalmente a dirección para justificar una compensación adecuada. El tono es de propuesta profesional, dejando que el valor de la plataforma hable por sí solo — sin mencionar explícitamente cifras salariales.

---

## Estructura del documento (secciones en PROPUESTA_COMPLETA.html)

| Sección | Contenido |
|---------|-----------|
| Portada | Título "Plataforma LLM & RAG", metadatos |
| Carta de Presentación | Trayectoria personal de Luis (FP → ASIR → CC), motivación para la IA |
| 01 · Shimmer Platform — Servicios Disponibles | Open WebUI como núcleo, 9 agentes, RAG, bots, OpenSea (extra) |
| 02 · Descripción de la Plataforma | Arquitectura técnica, stack, entornos Docker |
| 03 · Resultados y Roadmap | Fase piloto, proyección, roadmap inmediato + corto/medio/largo plazo |
| 04 · Implicaciones Técnicas y Responsabilidades | Responsabilidades desarrollo y gestión, rol multidisciplinar, Compromisos y Ruegos, Conclusión |
| 05 · Terminología Técnica | Glosario para audiencia no técnica |

---

## Decisiones de diseño tomadas

- **OpenSea** se presenta como "proyecto adicional / muestra de capacidades", NO como entregable comprometido. Nació como campo de pruebas técnico y derivó en app náutica completa.
- **Sin cifras de consultora externa** — eliminadas a petición del usuario
- **Sin sección de compensación explícita** — el valor queda implícito en la envergadura del trabajo
- **Arquitectura híbrida**: IA local por defecto + opción de conectar modelos premium externos vía API
- **Bots** descritos como canal de acceso móvil para técnicos y comerciales en campo (Telegram, WhatsApp, Discord)
- **G3 (Mercury Marine)** incluido dentro del RAG local de Servicio y Taller (van de la mano)
- **Costes de herramientas** (VS Code + Aplicativo CLI): 100-280€/mes, mencionados como equipamiento técnico
- **"65 años de conocimiento"** eliminado — Luis lleva 8 años en la empresa; se usa en su lugar "ocho años de contexto"
- **Sección renombrada**: "Condiciones y Compromisos" → "Compromisos y Ruegos" (tono propositivo, no impositivo)
- **Numeración de páginas**: CSS `@page counter(page)/counter(pages)` — funciona en Chrome print dialog
- **Guiones dobles** (—texto—) sustituidos por paréntesis en todo el documento

---

## Datos clave de la fase piloto (reales, no estimaciones)

| Perfil | Ahorro medido |
|--------|--------------|
| 2 empleados Servicio | ~15 h/mes |
| Director de Servicio | ~2-3 h/mes |
| **Total piloto** | **~17-18 h/mes** |

Proyección total empresa si se escala: 50-80 h/mes (estimación extrapolada, no confirmada).

---

## Compromisos y Ruegos (sección final de responsabilidades)

1. **Documentación continua** — workflow diseñado con dos ramas: técnico/arquitecto + rama para IA (fine-tuning futuro con todo el historial)
2. **Propiedad intelectual** — todo pertenece a Touron S.A.
3. **Costes de software** — open source para la plataforma; herramientas especializadas (VS Code + Aplicativo CLI) 100-280€/mes
4. **Reconocimiento del rol** — compensación proporcional al alcance, revisable al crecer
5. **Infraestructura** — servidor dedicado como paso previo para producción real
6. **Escalado externo** — cualquier extensión a terceros de mutuo acuerdo
7. **Colaboración interna** — RAGs se nutren de documentación de los departamentos
8. **Formación en prompting** — Luis se compromete a impartirla

---

## Roadmap — Inmediatos (con servidor dedicado)

- Plataforma completa en producción (sustituye el uso de ChatGPT personal de los empleados)
- 9 agentes especializados disponibles desde el primer día
- RAG local para Servicio y Taller (manuales Mercury, fichas, procedimientos + asistente G3)
- Bots de mensajería (Telegram/WhatsApp)
- RAG SharePoint Online (diseño técnico completo, solo necesita credenciales Azure)

## Roadmap — Corto, medio y largo plazo

- Integración ERP Libra (usuario de lectura dedicado para el agente)
- RAG vía SharePoint sincronizado
- Personalización por departamento (Comercial, Marketing, Administración, Finanzas)
- Escalado a clientes externos (náuticas, astilleros, talleres colaboradores) — de mutuo acuerdo

---

## Terminología (secciones del glosario)

- IA y Modelos de Lenguaje: IA, LLM, Modelo de IA, Prompt/Prompt Engineering, Skill/Workflow, Fine-tuning
- RAG: RAG, Embedding
- Infraestructura: Servidor dedicado, Docker/Contenedor, Docker Compose, Ollama, Open WebUI, API, Lock-in, Open Source
- Desarrollo de Software: Full-stack, Frontend, Backend, Git/Control de versiones, Aplicativo CLI

---

## Contexto de la empresa (para referencia)

- **Touron S.A.** — Distribuidor oficial Mercury/Brunswick (~50 empleados, Madrid + Cascais Portugal)
- **Productos:** Mercury, Quicksilver, Bayliner, Navan, Simrad, Lowrance. Taller propio.
- **ERP:** Libra (Oracle). Microsoft 365 + SharePoint Online.
- **Luis Conde:** Técnico de Sistemas. 8 años en la empresa. Compañeros IT: José Sanz (Oracle), Tomás Ruiz-Roso (Big Data), Viviana Franco (Microsoft).
- **Stack Shimmer:** Open WebUI v0.8.12 + Ollama (host Windows) + Docker. 9 agentes. Bots Telegram/WhatsApp. Webapp OpenSea (~3.800 líneas).
