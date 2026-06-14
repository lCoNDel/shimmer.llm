# Demo: Inteligencia de Negocio sobre Datos ERP — Touron S.A.

**Plataforma:** Shimmer LLM — Open WebUI + Ollama  
**Tool:** `analisis_negocio.py`  
**Datos:** Histórico ficticio 2020–2025 · 50 referencias · catálogo náutico Touron

---

## Instalación de la tool

1. Open WebUI → **Workspace** → **Tools** → **+** (crear nueva tool)
2. Pegar el contenido de `.docker/openweb/tools/analisis_negocio.py`
3. Guardar → activar la tool en el modelo de tu elección
4. Crear nuevo chat y habilitar la tool (icono llave inglesa)

---

## Caso de uso 1 — Márgenes con ventas crecientes no actualizados

**Contexto:** Hay referencias que cada año venden más, pero el margen de venta no se ha revisado. El dinero se deja sobre la mesa.

**Pregunta para el chat:**
```
¿Qué productos de nuestro catálogo llevan años creciendo en ventas pero todavía tienen el margen por debajo del 25%? Dime cuánto dinero adicional generaríamos si los ajustáramos y qué precio de venta deberíamos poner.
```

**Lo que verás:** El modelo detectará que el **Aceite Mercury 4T SAE 10W-30 1L** ha crecido un +126% en ventas entre 2022 y 2025 pero mantiene un margen del 17,9%. Calculará el beneficio adicional estimado si se sube el margen al 25% y sugerirá un precio de venta concreto.

---

## Caso de uso 2 — Por qué un producto vendía poco (cruce stock-ventas)

**Contexto:** El impulsor Jabsco 18590 se vendía muy poco entre 2020 y 2022. ¿Era porque no había demanda, o porque no había stock?

**Pregunta para el chat:**
```
Analiza el histórico del impulsor Jabsco 18590. Quiero entender por qué vendíamos tan poco en 2021 y cuánto margen perdimos por eso.
```

**Lo que verás:** El modelo cruzará el stock disponible con las ventas mensuales y encontrará una correlación de Pearson ~0.85. En 2021 el stock medio era de 2 unidades — las ventas estaban literalmente bloqueadas por falta de producto. Desde 2023, con stock normalizado (15-17u), las ventas se triplicaron. Calculará el margen perdido estimado.

---

## Caso de uso 3 — Stock inmovilizado sin rotación

**Contexto:** Hay referencias con stock que llevan meses sin venderse. Capital paralizado, riesgo de obsolescencia.

**Pregunta para el chat:**
```
¿Qué referencias llevamos más de 6 meses sin vender pero seguimos teniendo stock? Dime el coste total inmovilizado y qué deberíamos hacer con cada una.
```

**Lo que verás:** El modelo detectará el **Simrad NSS9 evo3S** (6 unidades, última venta en abril de 2025, coste inmovilizado: 6.900€) entre otros. Para cada referencia propondrá una acción: descuento agresivo, devolución a proveedor o liquidación por campaña.

---

## Caso de uso 4 — Pronóstico de ventas por trimestre

**Contexto:** Touron quiere saber cuánto stock de ánodos de zinc necesita para el verano.

**Pregunta para el chat:**
```
¿Cuántas unidades de ánodos de zinc Mercury 75-90HP necesito tener en stock para el tercer trimestre de 2026? Dame el pronóstico de ventas y el rango.
```

**Lo que verás:** El modelo tomará el histórico de Q3 para los años 2021–2025, calculará la tendencia de crecimiento (+5%/año) y la fuerte estacionalidad veraniega. Devolverá un pronóstico de ~72–75 unidades para julio-agosto-septiembre 2026, con rango mínimo-máximo, e indicará el stock de seguridad recomendado.

---

## Preguntas adicionales para explorar en la demo

```
Lista todos los productos de la categoría Lubricantes que deberíamos revisar en precio.
```

```
¿Cuál es el pronóstico de ventas del Simrad GO9 XSE para el Q4 de 2026?
```

```
Muéstrame el cruce de stock y ventas del filtro de aceite Mercury (MRC-FLT-OIL).
```

```
¿Qué referencias de hélices tenemos con stock inmovilizado de más de 3 meses?
```

---

## Códigos de producto para referencia rápida

| Código | Producto |
|---|---|
| `MRC-4T-1L` | Aceite Mercury 4T SAE 10W-30 1L |
| `MRC-4T-4L` | Aceite Mercury 4T SAE 10W-30 4L |
| `JAB-18590` | Impulsor Jabsco 18590-0001 |
| `AZN-MRC75` | Ánodo Zinc Mercury 75-90HP |
| `SIM-NSS9` | Simrad NSS9 evo3S Multifunción |
| `SIM-GO9XSE` | Simrad GO9 XSE |
| `MRC-FLT-OIL` | Filtro Aceite Mercury 4T |
| `HLC-MRC-B1` | Hélice Mercury BlackMax 10.5x13 |

---

## Nota técnica

Los datos son **ficticios** generados algorítmicamente. Los patrones de negocio (correlaciones, estacionalidad, tendencias) son verosímiles para un distribuidor náutico. No usar fuera del entorno de demo.
