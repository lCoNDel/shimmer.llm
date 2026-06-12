# Plan de Migración — Shimmer Cloud

## Fases

### Fase 0 — Prerequisitos Azure
> Antes de tocar la VM. Todo en el portal Azure.

- [ ] Aprovisionar VM Linux (candidata: D4as v5) en el tenant Touron
- [ ] Configurar acceso SSH con clave pública
- [ ] Crear recurso Azure OpenAI en la suscripción
- [ ] Desplegar modelos en Azure OpenAI:
  - [ ] Modelo de chat (GPT-4o o equivalente — por decidir)
  - [ ] Modelo de embeddings: `text-embedding-3-large`
- [ ] Decidir región (candidata: West Europe)
- [ ] Abrir puertos necesarios en el NSG (Network Security Group):
  - 22 (SSH — restringido a IP de Touron)
  - 80 / 443 (HTTP/HTTPS — acceso a Open WebUI)

### Fase 1 — Servidor base
> Primera conexión a la VM. Preparar el entorno antes de desplegar nada.

- [ ] Conectar con VS Code Remote - SSH
- [ ] Instalar Docker + Docker Compose
- [ ] Instalar Node.js + Claude Code (`npm install -g @anthropic-ai/claude-code`)
- [ ] Autenticar Claude Code con cuenta claude.ai
- [ ] Clonar repositorio shimmer.llm en la VM
- [ ] Verificar estructura de carpetas y acceso a `.shimmercloud/`

### Fase 2 — Entorno de desarrollo (primer despliegue)
> Validar que todo funciona en dev antes de montar producción.

- [ ] Adaptar `dev.yml` para Azure:
  - Eliminar referencias a Ollama (`OLLAMA_BASE_URL`)
  - Configurar conexión a Azure OpenAI
- [ ] Desplegar Open WebUI dev
- [ ] Verificar login y acceso básico
- [ ] Configurar modelo Azure OpenAI en Open WebUI
- [ ] Importar Knowledge Base (Manuales Mercury)
- [ ] Verificar RAG funcional contra Azure OpenAI
- [ ] Desplegar y verificar bot Telegram en dev

### Fase 3 — Entorno de producción
> Solo cuando dev esté validado al 100%.

- [ ] Adaptar `prod.yml` para Azure (igual que dev.yml pero con variables prod)
- [ ] Desplegar Open WebUI prod
- [ ] Configurar branding Touron LLM (CSS, favicon, parche env.py)
- [ ] Migrar Knowledge Base desde entorno local (backup + restore de volumen)
- [ ] Configurar bot Telegram apuntando a prod
- [ ] Verificar cadena completa: usuario → Open WebUI → Azure OpenAI → RAG

### Fase 4 — Acceso y seguridad
- [ ] Configurar HTTPS (certificado — Let's Encrypt o cert Azure)
- [ ] Dominio o subdominio para acceso externo (por decidir)
- [ ] Acceso via Tailscale o equivalente para administración
- [ ] Revisar permisos y variables de entorno sensibles

### Fase 5 — RAG SharePoint (piloto)
> Una vez el entorno base esté estable en producción.

- [ ] App Registration en Azure AD (permisos `Sites.Read.All`, `Files.Read.All`)
- [ ] Configurar y desplegar `sharepoint-sync` contra la KB de prod
- [ ] Validar sincronización con carpetas piloto
- [ ] Configurar embeddings duales:
  - Docs internos → `bge-m3`
  - Manuales públicos → `text-embedding-3-large`

---

## Cambios de arquitectura respecto al entorno local

| Componente | Local (actual) | Cloud (Azure) |
|---|---|---|
| Inferencia LLM | Ollama en host Windows | Azure OpenAI API |
| Embeddings | bge-m3 en Ollama | bge-m3 local + text-embedding-3-large (Azure OpenAI) |
| Red interna | `host.docker.internal` | Red Docker interna (`localhost` o nombre de servicio) |
| HTTPS | Solo tsamaps (Tailscale) | Toda la plataforma |
| Acceso externo | Tailscale | Por definir |

---

## Notas

- No arrancar prod y dev simultáneamente si comparten volumen Open WebUI — misma restricción que en local.
- El parche `env.py` de Open WebUI para eliminar el sufijo " (Open WebUI)" se pierde al recrear el contenedor — reaplicar tras cada recreación.
- La API key de Open WebUI prod (`sk-...`) cambiará al migrar — actualizar en `asistente_nautico.py`.
- **tsamaps queda fuera de la migración** — proyecto EOL desde 2026-06-12, archivado en `.webapps/antiguos/tsamaps/`; solo se arranca puntualmente para demos en el entorno local.
