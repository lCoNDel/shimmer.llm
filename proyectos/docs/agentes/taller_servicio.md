# Agente — Taller de Servicio Técnico

**Estado**: Producción (Open WebUI)

## Descripción

Agente de soporte al taller de servicio técnico de Touron. Diseñado para todo tipo de usuarios, no solo técnicos.

## Funcionamiento

1. Recibe la solicitud del usuario en lenguaje natural
2. Reconvierte la solicitud para mejorar la precisión del RAG (adapta terminología, desambigua)
3. Lanza la búsqueda en paralelo en **español** e **inglés**
4. Responde sintetizando los resultados

La doble búsqueda ES+EN es necesaria porque los manuales técnicos de Mercury/Brunswick están en múltiples idiomas y el mismo concepto puede estar documentado solo en uno de ellos.

## Knowledge Base

RAG sobre documentación técnica multilingüe (manuales de producto, procedimientos de servicio).

## Roadmap

- [ ] Añadir portugués (sucursal Cascais)
