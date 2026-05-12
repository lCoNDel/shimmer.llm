# Demo ERP-IA — Análisis de negocio con datos Touron

**Estado:** Pendiente de implementar  
**Origen:** Reunión con consultor ERP (Oracle) que presentó aplicativo IA de explotación de datos.  
**Idea:** Montar un caso de uso equivalente en Shimmer LLM como demo de la plataforma.

---

## Concepto

Tool para Open WebUI que lee tres CSV (simulan tablas Oracle del ERP) montados en el contenedor via bind mount. El modelo llama a la tool en lenguaje natural y obtiene análisis exactos sobre los datos.

**3 "tablas ERP":**
- `productos.csv` → catálogo (50 referencias náuticas Mercury/Simrad/Jabsco)
- `ventas.csv` → histórico mensual 2020–2025 (~3600 filas)
- `stock.csv` → histórico mensual 2020–2025 (~3600 filas)

**4 casos de uso listos para demo:**
1. Márgenes bajos con ventas crecientes — "¿Qué productos deberíamos subir de precio?"
2. Cruce stock-ventas — "¿Por qué el Jabsco 18590 vendía tan poco en 2021?"
3. Stock inmovilizado sin rotación — "¿Qué referencias llevan meses sin vender?"
4. Pronóstico de ventas por trimestre — "¿Cuántos ánodos necesito para el Q3 2026?"

---

## Archivos

| Archivo | Descripción |
|---|---|
| `analisis_negocio.py` | Tool Python para Open WebUI — lee los CSV, 4 métodos |
| `demo_erp_ia.md` | Guía de presentación con preguntas de demo |
| `datos_touron/generar_datos.py` | Script de generación de CSVs (ejecutar en host) |
| `datos_touron/productos.csv` | Catálogo ficticio — 50 referencias |
| `datos_touron/ventas.csv` | Histórico ventas 2020-2025 |
| `datos_touron/stock.csv` | Histórico stock 2020-2025 |

---

## Para implementar

1. Copiar `datos_touron/` a `.docker/openweb/tools/data/touron/`
2. Añadir bind mount en `prod.yml`:
   ```yaml
   - ../openweb/tools/data/touron:/app/data/touron
   ```
3. Reiniciar open-webui: `docker compose -f prod.yml up -d`
4. Verificar mount: `docker exec open-webui ls /app/data/touron`
5. Instalar `analisis_negocio.py` en Open WebUI → Workspace → Tools
