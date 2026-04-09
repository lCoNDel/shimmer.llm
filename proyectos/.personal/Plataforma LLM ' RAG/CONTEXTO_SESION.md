# Contexto de sesión — Continuación en otra máquina
**Fecha:** Abril 2026  
**Proyecto:** Propuesta técnica formal — Plataforma IA Shimmer LLM para Touron S.A.

---

## Qué se ha construido en esta sesión

Se han creado los documentos de propuesta técnica en:
```
proyectos/.personal/Plataforma LLM ' RAG/
├── assets/style.css
├── 00_propuesta_ejecutiva.html
├── 01_plataforma_base.html
├── 02_agentes_y_software.html
├── 03_resultados_y_roadmap.html
└── 04_responsabilidades.html
```

Son archivos HTML con CSS compartido, diseñados para abrirse en Chrome/Edge y exportar a PDF con `Ctrl+P → Guardar como PDF`. Sin dependencias externas.

---

## Propósito del documento

Luis Conde trabaja en Touron S.A. como Técnico de Sistemas. Ha desarrollado internamente la plataforma de IA **Shimmer LLM** y necesita presentarla formalmente a dirección para justificar una compensación adecuada. El tono es de propuesta de consultora externa, dejando que el valor de la plataforma hable por sí solo (sin mencionar explícitamente el salario — eso queda implícito en la envergadura del trabajo).

---

## Estructura de los documentos (5 PDFs independientes)

| Archivo | Contenido |
|---------|-----------|
| `00_propuesta_ejecutiva.html` | Portada + Resumen Ejecutivo + Contexto y Motivación |
| `01_plataforma_base.html` | Arquitectura, Stack técnico, Docker |
| `02_agentes_y_software.html` | 9 Agentes IA + Bots de mensajería + OpenSea (extra) |
| `03_resultados_y_roadmap.html` | Resultados fase piloto + Roadmap |
| `04_responsabilidades.html` | Responsabilidades + Condiciones + Compensación (en blanco) + Conclusión |

---

## Decisiones de diseño tomadas

- **OpenSea** se presenta como "proyecto adicional / muestra de capacidades", NO como entregable comprometido
- **Sin cifras de consultora externa** — se eliminaron a petición del usuario
- **Sección de compensación** (04_responsabilidades.html) tiene un bloque en blanco con línea discontinua para que Luis lo complete a mano antes de imprimir
- El objetivo es que la dirección vea el valor y llegue sola a la conclusión, sin que Luis diga explícitamente "págame más"
- **Arquitectura híbrida** destacada: IA local por defecto + opción de conectar modelos premium externos vía API
- **Bots** descritos como canal de acceso móvil para técnicos en campo y comerciales en visitas
- **G3 (Mercury Marine)** mencionado como caso de uso en exploración en el Dpto. de Servicio (no en taller), ahorro pendiente de medir
- **Costes de herramientas** (VS Code + Claude Code) mencionados como equipamiento técnico que debe cubrir la empresa
- **Documento de costes de plataforma** — existe por separado, ya lo tiene Luis; en el HTML solo se referencia como "documento adjunto"

---

## Datos clave de la fase piloto (reales, no estimaciones)

| Perfil | Ahorro medido |
|--------|--------------|
| 2 empleados Servicio | ~15 h/mes |
| Director de Servicio | ~2-3 h/mes |
| **Total piloto** | **~17-18 h/mes** |

Proyección total empresa si se escala: 50-80 h/mes (estimación extrapolada, no confirmada).

---

## Nota personal de Luis (incluida en el doc 00)

> "He comprendido que el valor fundamental de desarrollar un proyecto como este de forma interna no es solo técnico, sino estratégico: se trata de transformar el saber hacer de más de 65 años de Touron en un activo digital exclusivo. Al ser una iniciativa propia, la herramienta nace con el ADN de Touron y el mundo náutico, lo que permite una integración mucho más orgánica con las marcas representadas y una defensa más sólida de la propiedad intelectual. Una decisión así nos posicionaría no solo como un distribuidor, sino como un creador tecnológico, elevando el prestigio de la marca ante nuestros clientes y proveedores."

---

## Posibles continuaciones / pendientes

1. **Completar la sección de compensación** en `04_responsabilidades.html` antes de imprimir (bloque con línea discontinua)
2. **Revisión de contenido** — puede que Luis quiera ajustar cifras, redacción o añadir más contexto tras releer los documentos
3. **Posible doc adicional de costes** — Luis ya tiene un documento de costes por separado que se referencia como adjunto; podría integrarse o diseñarse en el mismo estilo HTML
4. **Ajustes de estilo** — si algo no queda bien en el PDF (saltos de página, tablas partidas), se puede ajustar en `assets/style.css`

---

## Contexto de la empresa (para referencia)

- **Touron S.A.** — Distribuidor oficial Mercury/Brunswick (~50 empleados, Madrid + Cascais Portugal)
- **Productos:** Mercury, Quicksilver, Bayliner, Navan, Simrad, Lowrance. Taller propio.
- **ERP:** Libra (Oracle). Microsoft 365 + SharePoint Online.
- **Luis Conde:** Técnico de Sistemas. Compañeros IT: José Sanz (Oracle), Tomás Ruiz-Roso (Big Data), Viviana Franco (Microsoft).
- **Stack Shimmer:** Open WebUI v0.8.12 + Ollama (host Windows) + Docker. 9 agentes. Bot Telegram. Webapp OpenSea.
