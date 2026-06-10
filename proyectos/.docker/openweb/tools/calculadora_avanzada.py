"""
title: Calculadora Avanzada
author: shimmer.llm
description: Calculadora completa para agentes IA — expresiones matemáticas (evaluador seguro AST), estadística, conversor universal de unidades, finanzas (préstamos, interés compuesto), porcentajes, IVA, márgenes comerciales y cálculos con fechas.
version: 1.0.0
"""

import ast
import math
import statistics as stats
from datetime import date, datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional

from pydantic import BaseModel


# ── Formato español ────────────────────────────────────────────────────────────

def _fmt(n, decimals: int = 2) -> str:
    if isinstance(n, Decimal):
        rounded = float(n.quantize(Decimal("0." + "0" * decimals) if decimals else Decimal("1"), rounding=ROUND_HALF_UP))
    else:
        rounded = round(float(n), decimals)
    formatted = f"{rounded:,.{decimals}f}"
    return formatted.replace(",", "X").replace(".", ",").replace("X", ".")


def _fmt_auto(n: float) -> str:
    if isinstance(n, float) and (math.isnan(n) or math.isinf(n)):
        return str(n)
    if float(n) == int(n) and abs(n) < 1e15:
        return _fmt(n, 0)
    s = f"{float(n):.10f}".rstrip("0")
    int_part, dec_part = s.split(".")
    sign = "-" if int_part.startswith("-") else ""
    int_fmt = f"{abs(int(int_part)):,}".replace(",", ".")
    return f"{sign}{int_fmt},{dec_part}" if dec_part else f"{sign}{int_fmt}"


# ── Evaluador seguro de expresiones (AST) ─────────────────────────────────────

_ALLOWED_FUNCS = {
    "abs": abs, "round": round, "min": min, "max": max, "sum": sum, "len": len,
    "sqrt": math.sqrt, "cbrt": lambda x: math.copysign(abs(x) ** (1 / 3), x),
    "exp": math.exp, "log": math.log, "log10": math.log10, "log2": math.log2,
    "sin": math.sin, "cos": math.cos, "tan": math.tan,
    "asin": math.asin, "acos": math.acos, "atan": math.atan, "atan2": math.atan2,
    "sinh": math.sinh, "cosh": math.cosh, "tanh": math.tanh,
    "degrees": math.degrees, "radians": math.radians,
    "floor": math.floor, "ceil": math.ceil, "trunc": math.trunc,
    "factorial": math.factorial, "gcd": math.gcd, "lcm": math.lcm,
    "comb": math.comb, "perm": math.perm, "hypot": math.hypot,
    "mean": stats.mean, "median": stats.median, "mode": stats.mode,
    "stdev": stats.stdev, "pstdev": stats.pstdev,
    "variance": stats.variance, "pvariance": stats.pvariance,
}

_ALLOWED_CONSTS = {"pi": math.pi, "e": math.e, "tau": math.tau, "inf": math.inf}

_ALLOWED_NODES = (
    ast.Expression, ast.BinOp, ast.UnaryOp, ast.Constant, ast.Call, ast.Name,
    ast.Load, ast.List, ast.Tuple, ast.Attribute,
    ast.Add, ast.Sub, ast.Mult, ast.Div, ast.FloorDiv, ast.Mod, ast.Pow,
    ast.USub, ast.UAdd,
)


def _safe_eval(expression: str):
    expr = expression.strip().replace("^", "**")
    # coma decimal española → punto, solo si no parece separador de lista
    if "," in expr and "(" not in expr and "[" not in expr:
        expr = expr.replace(",", ".")

    tree = ast.parse(expr, mode="eval")
    for node in ast.walk(tree):
        if not isinstance(node, _ALLOWED_NODES):
            raise ValueError(f"Elemento no permitido en la expresión: {type(node).__name__}")
        if isinstance(node, ast.Constant) and not isinstance(node.value, (int, float)):
            raise ValueError("Solo se permiten constantes numéricas.")
        if isinstance(node, ast.Attribute):
            # permitir math.xxx por compatibilidad
            if not (isinstance(node.value, ast.Name) and node.value.id == "math"):
                raise ValueError("Solo se permite el prefijo math.")
            if node.attr.startswith("_") or node.attr not in dir(math):
                raise ValueError(f"math.{node.attr} no permitido.")
        if isinstance(node, ast.Name):
            if node.id not in _ALLOWED_FUNCS and node.id not in _ALLOWED_CONSTS and node.id != "math":
                raise ValueError(f"Nombre no permitido: {node.id}")
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id not in _ALLOWED_FUNCS:
                raise ValueError(f"Función no permitida: {node.func.id}")
        if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Pow):
            if isinstance(node.right, ast.Constant) and isinstance(node.right.value, (int, float)) and abs(node.right.value) > 10000:
                raise ValueError("Exponente demasiado grande.")

    env = dict(_ALLOWED_FUNCS)
    env.update(_ALLOWED_CONSTS)
    env["math"] = math
    return eval(compile(tree, "<expr>", "eval"), {"__builtins__": {}}, env)  # noqa: S307


# ── Conversor universal de unidades ───────────────────────────────────────────
# Cada dimensión define su unidad base y el factor de cada unidad a la base.

_DIMENSIONS = {
    "longitud": {
        "m": 1.0, "km": 1000.0, "cm": 0.01, "mm": 0.001,
        "nm": 1852.0, "mi": 1609.344, "yd": 0.9144, "ft": 0.3048, "in": 0.0254,
    },
    "velocidad": {  # base: km/h
        "kmh": 1.0, "knots": 1.852, "ms": 3.6, "mph": 1.609344,
    },
    "masa": {  # base: kg
        "kg": 1.0, "g": 0.001, "mg": 0.000001, "t": 1000.0,
        "lb": 0.45359237, "oz": 0.028349523, "st": 6.35029318,
    },
    "volumen": {  # base: litro
        "l": 1.0, "ml": 0.001, "m3": 1000.0,
        "gal": 3.785411784, "gal_uk": 4.54609, "qt": 0.946352946, "pt": 0.473176473,
    },
    "area": {  # base: m²
        "m2": 1.0, "cm2": 0.0001, "km2": 1_000_000.0, "ha": 10_000.0,
        "ft2": 0.09290304, "ac": 4046.8564224,
    },
    "presion": {  # base: bar
        "bar": 1.0, "psi": 0.0689475729, "atm": 1.01325, "pa": 0.00001, "kpa": 0.01, "mbar": 0.001, "mmhg": 0.00133322,
    },
    "potencia": {  # base: kW
        "kw": 1.0, "w": 0.001, "hp": 0.745699872, "cv": 0.73549875,
    },
    "energia": {  # base: kWh
        "kwh": 1.0, "wh": 0.001, "j": 1 / 3_600_000, "kj": 1 / 3600, "kcal": 0.001163,
    },
    "tiempo": {  # base: segundo
        "s": 1.0, "min": 60.0, "h": 3600.0, "d": 86400.0, "sem": 604800.0,
    },
    "datos": {  # base: MB (decimal)
        "mb": 1.0, "kb": 0.001, "gb": 1000.0, "tb": 1_000_000.0, "b": 0.000001,
    },
}

_ALIASES = {
    # longitud
    "metro": "m", "metros": "m", "meter": "m", "meters": "m",
    "kilometro": "km", "kilómetro": "km", "kilometros": "km", "kilómetros": "km",
    "milla nautica": "nm", "milla náutica": "nm", "millas nauticas": "nm", "millas náuticas": "nm",
    "nautical mile": "nm", "nautical miles": "nm",
    "milla": "mi", "millas": "mi", "mile": "mi", "miles": "mi",
    "pie": "ft", "pies": "ft", "foot": "ft", "feet": "ft",
    "pulgada": "in", "pulgadas": "in", "inch": "in", "inches": "in",
    "yarda": "yd", "yardas": "yd", "yard": "yd",
    # velocidad
    "km/h": "kmh", "nudo": "knots", "nudos": "knots", "knot": "knots", "kn": "knots",
    "m/s": "ms", "mi/h": "mph",
    # masa
    "kilo": "kg", "kilos": "kg", "kilogramo": "kg", "kilogramos": "kg",
    "gramo": "g", "gramos": "g", "tonelada": "t", "toneladas": "t", "ton": "t",
    "libra": "lb", "libras": "lb", "pound": "lb", "pounds": "lb", "onza": "oz", "onzas": "oz",
    # volumen
    "litro": "l", "litros": "l", "liter": "l", "liters": "l",
    "galon": "gal", "galón": "gal", "galones": "gal", "gallon": "gal", "gallons": "gal",
    "galon imperial": "gal_uk", "galón imperial": "gal_uk",
    # área
    "m²": "m2", "ft²": "ft2", "cm²": "cm2", "km²": "km2", "hectarea": "ha", "hectárea": "ha", "hectareas": "ha", "hectáreas": "ha", "acre": "ac", "acres": "ac",
    "metro cuadrado": "m2", "metros cuadrados": "m2", "pie cuadrado": "ft2", "pies cuadrados": "ft2",
    # presión
    "pascal": "pa", "pascales": "pa", "atmosfera": "atm", "atmósfera": "atm", "milibar": "mbar", "mmHg": "mmhg",
    # potencia
    "caballo": "cv", "caballos": "cv", "horsepower": "hp", "vatio": "w", "vatios": "w", "watt": "w", "watts": "w",
    # temperatura
    "celsius": "c", "centigrados": "c", "centígrados": "c", "°c": "c", "ºc": "c",
    "fahrenheit": "f", "°f": "f", "ºf": "f", "kelvin": "k", "kelvins": "k",
    # tiempo
    "segundo": "s", "segundos": "s", "minuto": "min", "minutos": "min",
    "hora": "h", "horas": "h", "dia": "d", "día": "d", "dias": "d", "días": "d",
    "semana": "sem", "semanas": "sem",
    # datos
    "byte": "b", "bytes": "b", "megabyte": "mb", "gigabyte": "gb", "terabyte": "tb",
}

_UNIT_LABELS = {
    "nm": "NM", "knots": "nudos", "kmh": "km/h", "ms": "m/s",
    "m2": "m²", "ft2": "ft²", "cm2": "cm²", "km2": "km²",
    "c": "°C", "f": "°F", "k": "K", "l": "L", "gal_uk": "gal (UK)",
    "cv": "CV", "hp": "HP", "kw": "kW", "kwh": "kWh", "m3": "m³",
}

_TEMP_TO_C = {"c": lambda v: v, "f": lambda v: (v - 32) * 5 / 9, "k": lambda v: v - 273.15}
_C_TO_TEMP = {"c": lambda v: v, "f": lambda v: v * 9 / 5 + 32, "k": lambda v: v + 273.15}


def _normalize_unit(u: str) -> str:
    u = u.lower().strip()
    return _ALIASES.get(u, u)


class Tools:
    class Valves(BaseModel):
        pass

    def __init__(self):
        self.valves = self.Valves()

    # ── Expresiones ────────────────────────────────────────────────────────────

    def calculate(self, expression: str) -> str:
        """
        Evaluates a mathematical expression safely and returns the exact result.
        Supports: + - * / // % ** ^, parentheses, lists, and functions:
        sqrt, cbrt, exp, log, log10, log2, sin/cos/tan (radians), asin/acos/atan,
        degrees, radians, floor, ceil, round, abs, factorial, gcd, lcm, comb, perm,
        sum, min, max, len, mean, median, mode, stdev, variance. Constants: pi, e, tau.
        Examples: "1852 * 12", "sqrt(144) + 2^10", "mean([4, 8, 15, 16, 23, 42])",
        "factorial(10) / comb(10, 3)", "sin(radians(45))"
        :param expression: mathematical expression as a string
        :return: formatted numeric result
        """
        try:
            result = _safe_eval(expression)
        except ZeroDivisionError:
            return "Error: división por cero."
        except Exception as e:
            return f"Error en la expresión: {e}"

        if isinstance(result, (list, tuple)):
            return "[" + ", ".join(_fmt_auto(x) for x in result) + "]"
        if not isinstance(result, (int, float)):
            return "El resultado no es un número."
        if isinstance(result, float) and (math.isnan(result) or math.isinf(result)):
            return "El resultado es indefinido (NaN o infinito)."
        return _fmt_auto(result)

    # ── Estadística ────────────────────────────────────────────────────────────

    def statistics(self, numbers: str) -> str:
        """
        Computes a full statistical summary of a list of numbers.
        Returns: count, sum, mean, median, mode, min, max, range, stdev, variance,
        percentiles 25/75 and coefficient of variation.
        Example: statistics("12, 15, 9, 22, 18, 15, 30")
        :param numbers: numbers separated by commas, semicolons or spaces
        :return: statistical summary
        """
        try:
            cleaned = numbers.replace(";", " ").replace(",", " ")
            data = [float(x) for x in cleaned.split() if x.strip()]
        except ValueError:
            return "No se pudieron interpretar los números. Sepáralos con comas o espacios."
        if not data:
            return "Lista vacía."

        n = len(data)
        mean_v = stats.mean(data)
        lines = [
            f"N: {n}",
            f"Suma: {_fmt_auto(sum(data))}",
            f"Media: {_fmt_auto(round(mean_v, 6))}",
            f"Mediana: {_fmt_auto(stats.median(data))}",
            f"Mín: {_fmt_auto(min(data))}",
            f"Máx: {_fmt_auto(max(data))}",
            f"Rango: {_fmt_auto(max(data) - min(data))}",
        ]
        try:
            lines.append(f"Moda: {_fmt_auto(stats.mode(data))}")
        except stats.StatisticsError:
            pass
        if n >= 2:
            sd = stats.stdev(data)
            lines.append(f"Desv. típica (muestral): {_fmt_auto(round(sd, 6))}")
            lines.append(f"Varianza (muestral): {_fmt_auto(round(stats.variance(data), 6))}")
            if mean_v != 0:
                lines.append(f"Coef. variación: {_fmt(sd / abs(mean_v) * 100, 2)}%")
        if n >= 4:
            q = stats.quantiles(data, n=4)
            lines.append(f"P25: {_fmt_auto(q[0])} | P75: {_fmt_auto(q[2])}")
        return "\n".join(lines)

    # ── Conversión de unidades ─────────────────────────────────────────────────

    def convert(self, value: float, from_unit: str, to_unit: str) -> str:
        """
        Converts between units of any supported dimension:
        length (m, km, cm, mm, nm, mi, yd, ft, in), speed (kmh, knots, ms, mph),
        mass (kg, g, t, lb, oz), volume (l, ml, m3, gal, gal_uk), area (m2, ft2, ha, ac, km2),
        pressure (bar, psi, atm, pa, kpa, mbar, mmhg), power (kw, w, hp, cv),
        energy (kwh, wh, j, kj, kcal), temperature (c, f, k), time (s, min, h, d, sem),
        data (b, kb, mb, gb, tb). Accepts Spanish and English unit names.
        Examples: convert(12, "nm", "km"), convert(250, "hp", "kw"), convert(2.5, "bar", "psi")
        :param value: numeric value to convert
        :param from_unit: source unit
        :param to_unit: target unit
        """
        f = _normalize_unit(from_unit)
        t = _normalize_unit(to_unit)
        f_label = _UNIT_LABELS.get(f, f)
        t_label = _UNIT_LABELS.get(t, t)

        # temperatura
        if f in _TEMP_TO_C and t in _C_TO_TEMP:
            result = _C_TO_TEMP[t](_TEMP_TO_C[f](float(value)))
            return f"{_fmt(value, 2)} {f_label} = {_fmt(result, 2)} {t_label}"

        for dim, units in _DIMENSIONS.items():
            if f in units and t in units:
                result = float(value) * units[f] / units[t]
                decimals = 6 if abs(result) < 0.01 else (4 if abs(result) < 1 else 3)
                return f"{_fmt_auto(value)} {f_label} = {_fmt(result, decimals).rstrip('0').rstrip(',')} {t_label}"
            if f in units and t not in units:
                return (
                    f"'{to_unit}' no pertenece a la dimensión '{dim}' de '{from_unit}'. "
                    f"Unidades compatibles: {', '.join(units)}"
                )

        dims = {d: ", ".join(u) for d, u in _DIMENSIONS.items()}
        return f"Unidad '{from_unit}' no reconocida. Dimensiones disponibles: {json_dims(dims)}"

    # ── Porcentajes ────────────────────────────────────────────────────────────

    def percentage(self, mode: str, a: float, b: float) -> str:
        """
        Percentage calculations. Modes:
        - "of": a% of b. percentage("of", 15, 200) → 15% de 200 = 30
        - "is": what % is a of b. percentage("is", 30, 200) → 30 es el 15% de 200
        - "change": % change from a to b. percentage("change", 80, 100) → +25%
        - "increase": b increased by a%. percentage("increase", 10, 500) → 550
        - "decrease": b decreased by a%. percentage("decrease", 10, 500) → 450
        :param mode: one of "of", "is", "change", "increase", "decrease"
        :param a: first value (percentage in of/increase/decrease, part in is, origin in change)
        :param b: second value (base amount, or destination in change)
        """
        mode = mode.lower().strip()
        if mode == "of":
            return f"{_fmt_auto(a)}% de {_fmt_auto(b)} = {_fmt_auto(round(a * b / 100, 10))}"
        if mode == "is":
            if b == 0:
                return "Error: la base no puede ser 0."
            return f"{_fmt_auto(a)} es el {_fmt(a / b * 100, 2)}% de {_fmt_auto(b)}"
        if mode == "change":
            if a == 0:
                return "Error: el valor de origen no puede ser 0."
            pct = (b - a) / abs(a) * 100
            sign = "+" if pct >= 0 else ""
            return f"De {_fmt_auto(a)} a {_fmt_auto(b)}: {sign}{_fmt(pct, 2)}%"
        if mode == "increase":
            return f"{_fmt_auto(b)} + {_fmt_auto(a)}% = {_fmt_auto(round(b * (1 + a / 100), 10))}"
        if mode == "decrease":
            return f"{_fmt_auto(b)} - {_fmt_auto(a)}% = {_fmt_auto(round(b * (1 - a / 100), 10))}"
        return "mode debe ser: of, is, change, increase o decrease."

    # ── IVA ────────────────────────────────────────────────────────────────────

    def vat(self, amount: float, rate: float = 21.0, direction: str = "add") -> str:
        """
        Calculates VAT breakdown. Spanish IVA default is 21%.
        direction="add": price without VAT → price with VAT.
        direction="remove": price with VAT → base price (extract VAT).
        Examples: vat(8264.46, 21, "add"), vat(10000, 21, "remove")
        :param amount: price amount in euros
        :param rate: VAT percentage (default 21)
        :param direction: "add" to add VAT, "remove" to extract VAT
        """
        amount_d = Decimal(str(amount))
        rate_d = Decimal(str(rate))

        if direction == "add":
            base = amount_d
            vat_amount = (base * rate_d / 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            total = base + vat_amount
        elif direction == "remove":
            total = amount_d
            base = (total / (1 + rate_d / 100)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            vat_amount = total - base
        else:
            return "direction debe ser 'add' o 'remove'."

        return (
            f"Base imponible: {_fmt(base)} €\n"
            f"IVA ({_fmt(rate_d, 0)}%): {_fmt(vat_amount)} €\n"
            f"Total: {_fmt(total)} €"
        )

    # ── Margen comercial ───────────────────────────────────────────────────────

    def margin(self, cost: float, price: Optional[float] = None, margin_pct: Optional[float] = None) -> str:
        """
        Calculates commercial margin. Two modes:
        - Given cost + price: returns margin % and profit.
        - Given cost + margin_pct: returns the selling price needed.
        Examples: margin(6000, price=8500), margin(6000, margin_pct=30)
        :param cost: unit cost in euros
        :param price: selling price in euros (optional)
        :param margin_pct: desired margin percentage over price (optional)
        """
        cost_d = Decimal(str(cost))

        if price is not None:
            price_d = Decimal(str(price))
            if price_d <= 0:
                return "El precio debe ser mayor que 0."
            profit = price_d - cost_d
            margin_calculated = (profit / price_d * 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            markup = (profit / cost_d * 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) if cost_d > 0 else Decimal("0")
            return (
                f"Coste: {_fmt(cost_d)} €\n"
                f"PVP: {_fmt(price_d)} €\n"
                f"Beneficio: {_fmt(profit)} €\n"
                f"Margen (sobre PVP): {_fmt(margin_calculated, 2)}%\n"
                f"Markup (sobre coste): {_fmt(markup, 2)}%"
            )

        if margin_pct is not None:
            pct_d = Decimal(str(margin_pct))
            if pct_d >= 100:
                return "El margen no puede ser 100% o superior."
            price_d = (cost_d / (1 - pct_d / 100)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            profit = price_d - cost_d
            return (
                f"Coste: {_fmt(cost_d)} €\n"
                f"Margen deseado: {_fmt(pct_d, 2)}%\n"
                f"PVP necesario: {_fmt(price_d)} €\n"
                f"Beneficio: {_fmt(profit)} €"
            )

        return "Indica 'price' o 'margin_pct' además del coste."

    # ── Finanzas ───────────────────────────────────────────────────────────────

    def loan(self, principal: float, annual_rate: float, years: float) -> str:
        """
        Calculates a loan's monthly payment (French amortization system).
        Example: loan(25000, 6.5, 5) → monthly payment for 25.000€ at 6,5% over 5 years.
        :param principal: loan amount in euros
        :param annual_rate: annual interest rate in % (TIN)
        :param years: loan duration in years
        """
        if principal <= 0 or years <= 0:
            return "El capital y la duración deben ser mayores que 0."
        n = round(years * 12)
        if annual_rate == 0:
            payment = principal / n
        else:
            i = annual_rate / 100 / 12
            payment = principal * i / (1 - (1 + i) ** -n)
        total = payment * n
        return (
            f"Capital: {_fmt(principal)} €\n"
            f"TIN: {_fmt(annual_rate, 2)}% | Plazo: {n} meses\n"
            f"Cuota mensual: {_fmt(payment)} €\n"
            f"Total pagado: {_fmt(total)} €\n"
            f"Intereses totales: {_fmt(total - principal)} €"
        )

    def compound_interest(self, principal: float, annual_rate: float, years: float, monthly_contribution: float = 0) -> str:
        """
        Calculates compound interest growth with optional monthly contributions
        (monthly compounding).
        Examples: compound_interest(10000, 5, 10), compound_interest(5000, 7, 20, 200)
        :param principal: initial amount in euros
        :param annual_rate: annual interest rate in %
        :param years: investment duration in years
        :param monthly_contribution: optional monthly contribution in euros
        """
        if years <= 0:
            return "La duración debe ser mayor que 0."
        n = round(years * 12)
        i = annual_rate / 100 / 12
        if i == 0:
            final = principal + monthly_contribution * n
        else:
            final = principal * (1 + i) ** n + monthly_contribution * (((1 + i) ** n - 1) / i)
        invested = principal + monthly_contribution * n
        return (
            f"Aportado: {_fmt(invested)} € ({_fmt(principal)} € inicial"
            + (f" + {_fmt(monthly_contribution)} €/mes" if monthly_contribution else "")
            + ")\n"
            f"Valor final ({_fmt_auto(years)} años al {_fmt(annual_rate, 2)}%): {_fmt(final)} €\n"
            f"Intereses generados: {_fmt(final - invested)} €"
        )

    # ── Fechas ─────────────────────────────────────────────────────────────────

    def date_calc(self, operation: str, date1: str, date2_or_days: str = "") -> str:
        """
        Date calculations. Dates in format YYYY-MM-DD or DD/MM/YYYY. Operations:
        - "diff": days between two dates. date_calc("diff", "2026-01-15", "2026-06-10")
        - "add": add days to a date. date_calc("add", "2026-06-10", "45")
        - "subtract": subtract days. date_calc("subtract", "2026-06-10", "30")
        - "weekday": day of the week. date_calc("weekday", "2026-06-10")
        :param operation: one of "diff", "add", "subtract", "weekday"
        :param date1: first date
        :param date2_or_days: second date (diff) or number of days (add/subtract)
        """
        def parse(s):
            s = s.strip()
            for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
                try:
                    return datetime.strptime(s, fmt).date()
                except ValueError:
                    continue
            if s.lower() in ("hoy", "today"):
                return date.today()
            raise ValueError(f"Fecha no reconocida: '{s}'. Usa YYYY-MM-DD o DD/MM/YYYY.")

        dias_semana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
        op = operation.lower().strip()

        try:
            d1 = parse(date1)
            if op == "diff":
                d2 = parse(date2_or_days)
                delta = (d2 - d1).days
                weeks = abs(delta) // 7
                return (
                    f"Entre {d1.isoformat()} y {d2.isoformat()}: {delta} días "
                    f"({weeks} semanas y {abs(delta) % 7} días)"
                )
            if op in ("add", "subtract"):
                days = int(float(date2_or_days))
                if op == "subtract":
                    days = -days
                result = d1 + timedelta(days=days)
                return f"{d1.isoformat()} {'+' if days >= 0 else '−'} {abs(days)} días = {result.isoformat()} ({dias_semana[result.weekday()]})"
            if op == "weekday":
                return f"{d1.isoformat()} es {dias_semana[d1.weekday()]}"
            return "operation debe ser: diff, add, subtract o weekday."
        except ValueError as e:
            return str(e)


def json_dims(dims: dict) -> str:
    return "; ".join(f"{k}: {v}" for k, v in dims.items())
