# Decisiones de Arquitectura — Shimmer Cloud

Registro de decisiones técnicas tomadas durante el proyecto.
Cada entrada incluye qué se decidió, por qué y qué alternativas se descartaron.

---

## ADR-001 — Azure OpenAI como motor de inferencia

**Estado**: Confirmado  
**Fecha**: Mayo 2026

**Decisión**: Toda la inferencia LLM se realiza via Azure OpenAI API. Ollama desaparece.

**Motivo**: Aprobación de gerencia. Paso de demo local a producción real en cloud corporativo. Azure OpenAI está dentro del tenant Touron, cumple requisitos de seguridad y privacidad de datos.

**Impacto**:
- Eliminar `OLLAMA_BASE_URL` de todos los compose
- Open WebUI se configura con Azure OpenAI como proveedor (endpoint + API key de Azure)
- Los modelos Ollama locales quedan solo para desarrollo/testing personal, no para la plataforma

---

## ADR-002 — Dos entornos separados en la misma VM

**Estado**: Confirmado  
**Fecha**: Mayo 2026

**Decisión**: Producción y desarrollo en la misma VM, con contenedores y volúmenes completamente independientes.

**Motivo**: Mismo modelo que funciona bien en local. Simplicidad operativa — una sola VM que gestionar.

**Alternativa descartada**: VM separada para cada entorno — coste innecesario en esta fase.

**Restricción**: No arrancar prod y dev simultáneamente si comparten volumen Open WebUI.

---

## ADR-003 — VM Linux como plataforma de despliegue

**Estado**: Confirmado (modelo de VM pendiente)  
**Fecha**: Mayo 2026

**Decisión**: VM Linux en Azure. Candidata: D4as v5 (4 vCPU, 16 GB RAM, AMD EPYC).

**Motivo**: Docker en Linux es el entorno nativo. Sin la capa de WSL/Docker Desktop que existe en el entorno local Windows.

**Alternativa descartada**: Azure Container Apps / App Service — mayor complejidad de gestión para este caso de uso, y Claude Code necesita acceso directo al sistema de archivos vía SSH.

---

## ADR-004 — Claude Code vía VS Code Remote - SSH

**Estado**: Confirmado  
**Fecha**: Mayo 2026

**Decisión**: El soporte de despliegue y operación se realiza con Claude Code conectado a la VM vía VS Code Remote - SSH.

**Motivo**: Mismo flujo de trabajo que en local. Claude Code puede leer archivos, ejecutar comandos y modificar configuración directamente en la VM.

**Requisitos**: Node.js en la VM, autenticación con cuenta claude.ai (suscripción Pro).

---

## Pendientes de decisión

| ID | Decisión | Notas |
|---|---|---|
| ADR-005 | Modelo LLM (Azure OpenAI) | Familia GPT-4o probable — por confirmar con gerencia o según coste |
| ADR-006 | Interfaz de usuario | Open WebUI probable — por confirmar |
| ADR-007 | Región Azure | West Europe recomendado (latencia Madrid) — por confirmar |
| ADR-008 | Acceso externo / dominio | Tailscale, dominio propio, o Azure DNS — por definir |
| ADR-009 | HTTPS / certificados | Let's Encrypt o certificado Azure — por definir |
