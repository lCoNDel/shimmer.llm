"""
title: Análisis de Negocio Touron
author: shimmer.llm
description: Analiza ventas, márgenes, stock y pronósticos leyendo tablas CSV del ERP de Touron S.A. montadas en /app/data/touron/
version: 2.0.0
requirements:
"""

import csv
import json
import math
import os

DATA_DIR = os.environ.get("TOURON_DATA_DIR", "/app/data/touron")


def _load_csv(filename: str) -> list:
    path = os.path.join(DATA_DIR, filename)
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f, delimiter=";"))


def _pearson(xs: list, ys: list) -> float:
    n = len(xs)
    if n < 2:
        return 0.0
    mx = sum(xs) / n
    my = sum(ys) / n
    num  = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    denx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    deny = math.sqrt(sum((y - my) ** 2 for y in ys))
    if denx == 0 or deny == 0:
        return 0.0
    return round(num / (denx * deny), 3)


def _linreg(xs: list, ys: list):
    n = len(xs)
    if n < 2:
        return 0.0, (sum(ys) / n if ys else 0.0)
    mx = sum(xs) / n
    my = sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = sum((x - mx) ** 2 for x in xs)
    slope = num / den if den else 0.0
    return slope, my - slope * mx


class Tools:

    def __init__(self):
        try:
            productos = _load_csv("productos.csv")
            ventas    = _load_csv("ventas.csv")
            stock     = _load_csv("stock.csv")
        except FileNotFoundError as e:
            raise RuntimeError(
                f"No se encontraron los datos del ERP en {DATA_DIR}. "
                f"Comprueba que el volumen está montado correctamente. ({e})"
            )

        self._prod  = {p["cod"]: p for p in productos}
        self._v_idx = {}
        self._s_idx = {}
        for v in ventas:
            self._v_idx.setdefault(v["cod_producto"], []).append(v)
        for s in stock:
            self._s_idx.setdefault(s["cod_producto"], []).append(s)

    # ── 1. REVISIÓN DE MÁRGENES ───────────────────────────────────────────────

    def analizar_margenes(self, top_n: int = 10, umbral_margen: float = 25.0) -> str:
        """
        Identifica productos con ventas en crecimiento pero margen por debajo del umbral.
        Lee la tabla PRODUCTOS y la tabla VENTAS del ERP para calcular tendencia y gap de margen.

        :param top_n: Número máximo de productos a devolver (por defecto 10).
        :param umbral_margen: Porcentaje de margen objetivo (por defecto 25.0).
        :return: JSON con ranking de productos y estimación de mejora económica.
        """
        resultados = []
        for cod, prod in self._prod.items():
            vp   = self._v_idx.get(cod, [])
            mrg  = float(prod["margen_pct"])
            pc   = float(prod["precio_compra"])
            pv   = float(prod["precio_venta"])

            v22 = sum(int(v["unidades"]) for v in vp if v["fecha"].startswith("2022"))
            v25 = sum(int(v["unidades"]) for v in vp if v["fecha"].startswith("2025"))
            if v22 == 0:
                continue

            crec = round((v25 - v22) / v22 * 100, 1)
            if mrg < umbral_margen and crec > 8:
                ingreso25 = sum(
                    int(v["unidades"]) * float(v["precio_real"])
                    for v in vp if v["fecha"].startswith("2025")
                )
                gap = (umbral_margen - mrg) / 100
                beneficio_adic = round(ingreso25 * gap * 0.80, 0)
                resultados.append({
                    "cod":                       cod,
                    "nombre":                    prod["nombre"],
                    "categoria":                 prod["categoria"],
                    "margen_actual_pct":         mrg,
                    "ventas_2022_uds":           v22,
                    "ventas_2025_uds":           v25,
                    "crecimiento_pct":           crec,
                    "gap_margen_pp":             round(umbral_margen - mrg, 1),
                    "precio_compra_eur":         pc,
                    "precio_venta_actual_eur":   pv,
                    "precio_venta_sugerido_eur": round(pc / (1 - umbral_margen / 100), 2),
                    "beneficio_adicional_est_eur": beneficio_adic,
                })

        resultados.sort(key=lambda x: x["beneficio_adicional_est_eur"], reverse=True)
        resultados = resultados[:top_n]
        total = sum(r["beneficio_adicional_est_eur"] for r in resultados)

        return json.dumps({
            "analisis":              "revision_margenes",
            "fuente":                "tablas ERP: PRODUCTOS + VENTAS",
            "fecha_referencia":      "2025-12",
            "umbral_margen_pct":     umbral_margen,
            "productos_detectados":  len(resultados),
            "potencial_total_eur":   total,
            "productos":             resultados,
            "instruccion": (
                "Eres analista de negocio de Touron S.A., distribuidor náutico oficial Mercury/Simrad. "
                "Analiza esta tabla de productos con margen bajo pero ventas en crecimiento sostenido. "
                "Para los más relevantes: indica el gap de margen, el impacto económico anual y el precio de venta "
                "sugerido. Argumenta por qué es el momento de subir el precio dado el crecimiento de ventas. "
                "Sé concreto, usa euros y porcentajes del JSON."
            ),
        }, ensure_ascii=False)

    # ── 2. CRUCE STOCK-VENTAS ─────────────────────────────────────────────────

    def cruce_stock_ventas(self, codigo_producto: str) -> str:
        """
        Analiza la correlación histórica entre stock disponible y ventas mensuales de un producto.
        Lee las tablas VENTAS y STOCK del ERP. Útil para detectar ventas reprimidas por falta de stock.

        :param codigo_producto: Código del producto (ej: JAB-18590).
        :return: JSON con tabla anual, correlación de Pearson e interpretación.
        """
        cod  = codigo_producto.strip().upper()
        prod = self._prod.get(cod)
        if not prod:
            sugerencias = [
                c for c, p in self._prod.items()
                if codigo_producto.lower() in p["nombre"].lower()
            ]
            return json.dumps({"error": f"Producto '{codigo_producto}' no encontrado.",
                               "sugerencias": sugerencias[:5]}, ensure_ascii=False)

        vp = {v["fecha"]: int(v["unidades"]) for v in self._v_idx.get(cod, [])}
        sp = {s["fecha"]: int(s["stock_disponible"]) for s in self._s_idx.get(cod, [])}

        fechas       = sorted(set(vp) | set(sp))
        ventas_serie = [vp.get(f, 0) for f in fechas]
        stock_serie  = [sp.get(f, 0) for f in fechas]
        corr = _pearson(stock_serie, ventas_serie)

        tabla_anual = []
        for year in range(2020, 2026):
            vy = [vp.get(f"{year}-{m:02d}", 0) for m in range(1, 13)]
            sy = [sp.get(f"{year}-{m:02d}", 0) for m in range(1, 13)]
            tabla_anual.append({
                "anyo":              year,
                "ventas_total_uds":  sum(vy),
                "ventas_media_mes":  round(sum(vy) / 12, 1),
                "stock_medio":       round(sum(sy) / 12, 1),
                "stock_min":         min(sy),
                "stock_max":         max(sy),
            })

        if corr >= 0.7:
            interp = f"Correlación alta ({corr}): cuando el stock era bajo las ventas también caían — demanda posiblemente reprimida."
        elif corr >= 0.4:
            interp = f"Correlación moderada ({corr}): el nivel de stock influye parcialmente en las ventas."
        else:
            interp = f"Correlación baja ({corr}): las ventas no parecen estar limitadas por el stock disponible."

        v21 = sum(vp.get(f"2021-{m:02d}", 0) for m in range(1, 13))
        v23 = sum(vp.get(f"2023-{m:02d}", 0) for m in range(1, 13))
        ventas_perdidas = max(0, round((v23 - v21) / 2 * 2))
        pv = float(prod["precio_venta"])
        mrg = float(prod["margen_pct"])

        return json.dumps({
            "analisis":           "cruce_stock_ventas",
            "fuente":             "tablas ERP: VENTAS + STOCK",
            "producto":           {"cod": cod, "nombre": prod["nombre"], "categoria": prod["categoria"],
                                   "precio_venta_eur": pv, "margen_pct": mrg},
            "correlacion_pearson":  corr,
            "interpretacion":       interp,
            "tabla_anual":          tabla_anual,
            "ventas_perdidas_est_uds": ventas_perdidas,
            "ventas_perdidas_est_eur": round(ventas_perdidas * pv * mrg / 100, 0),
            "instruccion": (
                "Eres analista de negocio de Touron S.A. Explica por qué este producto vendía menos en años anteriores "
                "cruzando los datos de stock y ventas. Calcula el margen de beneficio perdido por la falta de stock "
                "y recomienda un nivel de stock mínimo de seguridad para los próximos años. "
                "Usa los datos del JSON, sé concreto con cifras."
            ),
        }, ensure_ascii=False)

    # ── 3. DETECCIÓN DE OBSOLESCENCIA ─────────────────────────────────────────

    def detectar_obsolescencia(self, meses: int = 6) -> str:
        """
        Detecta productos con stock disponible pero sin ventas en los últimos N meses.
        Lee las tablas VENTAS y STOCK del ERP y calcula el capital inmovilizado.

        :param meses: Número de meses a comprobar hacia atrás (por defecto 6).
        :return: JSON con referencias en riesgo y coste total inmovilizado.
        """
        ref_year, ref_month = 2025, 12
        fechas_check = []
        y, m = ref_year, ref_month
        for _ in range(meses):
            fechas_check.append(f"{y}-{m:02d}")
            m -= 1
            if m == 0:
                m = 12
                y -= 1

        resultados = []
        for cod, prod in self._prod.items():
            vp = {v["fecha"]: int(v["unidades"]) for v in self._v_idx.get(cod, [])}
            sp = {s["fecha"]: int(s["stock_disponible"]) for s in self._s_idx.get(cod, [])}

            ventas_periodo = sum(vp.get(f, 0) for f in fechas_check)
            stk_actual     = sp.get("2025-12", 0)

            if ventas_periodo == 0 and stk_actual > 0:
                ultima_venta = None
                for f in sorted(vp, reverse=True):
                    if vp[f] > 0:
                        ultima_venta = f
                        break
                meses_inactivo = 0
                if ultima_venta:
                    uy, um = int(ultima_venta[:4]), int(ultima_venta[5:7])
                    meses_inactivo = (ref_year - uy) * 12 + (ref_month - um)

                pc = float(prod["precio_compra"])
                pv = float(prod["precio_venta"])
                resultados.append({
                    "cod":                   cod,
                    "nombre":                prod["nombre"],
                    "categoria":             prod["categoria"],
                    "stock_actual_uds":      stk_actual,
                    "ultima_venta":          ultima_venta or "sin datos",
                    "meses_sin_venta":       meses_inactivo,
                    "precio_compra_eur":     pc,
                    "precio_venta_eur":      pv,
                    "coste_inmovilizado_eur": round(stk_actual * pc, 2),
                })

        resultados.sort(key=lambda x: x["coste_inmovilizado_eur"], reverse=True)
        total = round(sum(r["coste_inmovilizado_eur"] for r in resultados), 2)

        return json.dumps({
            "analisis":               "obsolescencia_stock",
            "fuente":                 "tablas ERP: VENTAS + STOCK",
            "fecha_referencia":       "2025-12",
            "meses_analizados":       meses,
            "referencias_en_riesgo":  len(resultados),
            "coste_total_inmovilizado_eur": total,
            "referencias":            resultados,
            "instruccion": (
                "Eres analista de negocio de Touron S.A. Analiza estas referencias con stock inmovilizado sin rotación. "
                "Para cada una: explica el riesgo (obsolescencia tecnológica, estacionalidad, descatalogado...), "
                "estima el impacto financiero y propón una acción concreta (descuento, devolución a proveedor, "
                "campaña promocional, liquidación). Ordena las recomendaciones por urgencia y coste."
            ),
        }, ensure_ascii=False)

    # ── 4. PRONÓSTICO DE VENTAS ───────────────────────────────────────────────

    def pronostico_ventas(self, codigo_producto: str, trimestre: str = "2026-Q3") -> str:
        """
        Pronostica ventas de un producto para un trimestre futuro usando el histórico
        de la tabla VENTAS del ERP y regresión lineal sobre los mismos meses de años anteriores.

        :param codigo_producto: Código del producto (ej: AZN-MRC75).
        :param trimestre: Trimestre a pronosticar en formato AAAA-QN (ej: 2026-Q3).
        :return: JSON con histórico trimestral, tendencia y previsión con rango de confianza.
        """
        cod  = codigo_producto.strip().upper()
        prod = self._prod.get(cod)
        if not prod:
            sugerencias = [
                c for c, p in self._prod.items()
                if codigo_producto.lower() in p["nombre"].lower()
            ]
            return json.dumps({"error": f"Producto '{codigo_producto}' no encontrado.",
                               "sugerencias": sugerencias[:5]}, ensure_ascii=False)

        try:
            parts      = trimestre.upper().split("-Q")
            tgt_year   = int(parts[0])
            tgt_q      = int(parts[1])
        except Exception:
            return json.dumps({"error": "Formato de trimestre incorrecto. Usa AAAA-QN (ej: 2026-Q3)."},
                               ensure_ascii=False)

        q_months = {1:[1,2,3], 2:[4,5,6], 3:[7,8,9], 4:[10,11,12]}
        meses = q_months.get(tgt_q)
        if not meses:
            return json.dumps({"error": "Trimestre debe ser Q1, Q2, Q3 o Q4."}, ensure_ascii=False)

        vp = {v["fecha"]: int(v["unidades"]) for v in self._v_idx.get(cod, [])}

        historico = []
        for year in range(2021, 2026):
            total = sum(vp.get(f"{year}-{m:02d}", 0) for m in meses)
            historico.append({"anyo": year, "trimestre": f"{year}-Q{tgt_q}", "ventas_uds": total})

        xs = list(range(len(historico)))
        ys = [h["ventas_uds"] for h in historico]
        slope, intercept = _linreg(xs, ys)
        pred_x   = len(historico)
        pred_val = max(0, round(slope * pred_x + intercept))

        residuals = [abs(ys[i] - (slope * xs[i] + intercept)) for i in range(len(xs))]
        mad       = sum(residuals) / len(residuals) if residuals else 0
        rng_min   = max(0, round(pred_val - 1.5 * mad))
        rng_max   = round(pred_val + 1.5 * mad)
        crec_anual = round(slope / (ys[0] if ys[0] else 1) * 100, 1)

        pv_est     = round(float(prod["precio_venta"]) * (1 + 0.014 * (tgt_year - 2020)), 2)
        ingreso    = round(pred_val * pv_est, 0)
        margen_est = round(ingreso * float(prod["margen_pct"]) / 100, 0)

        return json.dumps({
            "analisis":              "pronostico_ventas",
            "fuente":                "tabla ERP: VENTAS",
            "producto":              {"cod": cod, "nombre": prod["nombre"], "categoria": prod["categoria"],
                                      "precio_venta_est_eur": pv_est, "margen_pct": float(prod["margen_pct"])},
            "trimestre_objetivo":    trimestre.upper(),
            "meses":                 [f"{tgt_year}-{m:02d}" for m in meses],
            "historico_trimestral":  historico,
            "tendencia_anual_pct":   crec_anual,
            "pronostico_uds":        pred_val,
            "rango_min_uds":         rng_min,
            "rango_max_uds":         rng_max,
            "ingreso_estimado_eur":  ingreso,
            "margen_estimado_eur":   margen_est,
            "instruccion": (
                "Eres analista de negocio de Touron S.A. Interpreta este pronóstico de ventas trimestral. "
                "Explica la tendencia observada, si hay estacionalidad relevante, y qué nivel de stock hay que "
                "tener disponible para cubrir el rango alto del pronóstico. "
                "Indica también el impacto en ingresos y margen bruto esperado. Usa las cifras del JSON."
            ),
        }, ensure_ascii=False)
