SHIMMER — BACKLOG
=================
Generado: mayo 2026
Proyecto: Shimmer LLM (Touron S.A.)
Entorno actual: Open WebUI v0.9.4 · Docker · Windows 11 local
Producción prevista: Azure cloud, noviembre 2026 · Inferencia via Azure OpenAI API


── PENDIENTES ────────────────────────────────────────────────────────────────

[ ] rag_sharepoint
    Integración RAG con SharePoint Online de Touron.
    Pendiente: App Registration en Azure.
    Embeddings:
      - Docs internos (presupuestos, fichas, procedimientos) → BGE-M3 en CPU VM Azure
      - Manuales públicos (Mercury, Simrad, Bayliner) → text-embedding-3-large (Azure OpenAI)
    Config Open WebUI: chunk 512/100 · Top K 12-15 · Rerank Top K 5
    Umbral relevancia 0.3 · BM25 weight 0.3 · Búsqueda híbrida ON · Texto enriquecido ON
    Reranker: BAAI/bge-reranker-v2-m3

[ ] diagnosis_motores
    Agente de diagnóstico de motores náuticos.
    Sin detalle adicional definido.

[ ] taller_servicio
    Agente para soporte al taller de servicio técnico.
    Sin detalle adicional definido.

[ ] base_datos
    Integración con ERP Libra (Oracle).
    Sin detalle adicional definido.

[ ] rag_obsidian
    RAG sobre vault Obsidian.
    Sin detalle adicional definido.

[ ] add_in_office
    Complemento Microsoft Office para Outlook y Excel.
    Arquitectura: task pane HTML/JS → API Open WebUI.
    Opción B: UI propia con branding Touron (no iframe a Open WebUI).
    Lee contexto activo: email abierto, rango Excel seleccionado.
    HTTPS obligatorio. Distribución interna via M365 Admin Center (Centralized Deployment).
    MVP estimado: 1-2 semanas.

[ ] docx_open_terminal
    Migrar generación de documentos Word de tool Python a Open Terminal (OWU v0.9.4+).
    El modelo genera código python-docx · Open WebUI lo ejecuta
    y entrega .docx descargable con preview inline.
    Pendiente:
      - Verificar compatibilidad python-docx en Pyodide (v0.9.4)
      - Definir system prompt con estilos Touron
      - Sustituir tool Python actual


── IMPLEMENTADOS ─────────────────────────────────────────────────────────────

[x] api_acceso_telefono
    Acceso a Shimmer vía API desde dispositivos móviles.

[x] asistente_nautico
    Asistente náutico Touron en Open WebUI.


── PRIORIDADES ACTUALES ──────────────────────────────────────────────────────

  1. Servidor producción Azure (VM D4as v5 · ~$125/mes · Premium SSD P10/P15)
  2. RAG SharePoint — piloto


── NOTAS TÉCNICAS ────────────────────────────────────────────────────────────

Azure VM recomendada: D4as v5 (4 vCPU, 16GB RAM, AMD EPYC)
Descartada B4ms (burstable, no apta para uso sostenido 5-15 usuarios)
Disco: Premium SSD P10/P15 (~$20-30/mes) por I/O de ChromaDB y BGE-M3
Servicios VM: Open WebUI · bots Telegram · RAG/ChromaDB

Modelos:
  - Producción → Azure OpenAI API (modelo por definir)
  - Testing local → qwen3:9b en 4070 Ti Super

Skills activas en .agents/skills/:
  ai-engineer · asesor-nautico · asistente-nautico-touron · blast-pilot
  diagnostico-motores · docker-backup · docker-expert · mk-asesor-360 · openweb-rebrand
