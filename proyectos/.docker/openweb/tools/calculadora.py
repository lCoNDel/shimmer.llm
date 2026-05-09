"""
title: Calculadora
author: lconde
description: Calculadora precisa — expresiones aritméticas, conversiones náuticas/temperatura/área, IVA y márgenes comerciales.
version: 1.1.0
"""

import math
import re
from decimal import Decimal, ROUND_HALF_UP
from pydantic import BaseModel


# nombres alternativos aceptados en convert()
_ALIASES = {
    "nautical mile": "nm", "nautical miles": "nm", "milla náutica": "nm", "millas náuticas": "nm",
    "knot": "knots", "nudo": "knots", "nudos": "knots", "kn": "knots",
    "kilometer": "km", "kilometers": "km", "kilómetro": "km", "kilómetros": "km",
    "kmh": "kmh", "km/h": "kmh",
    "foot": "ft", "feet": "ft", "pie": "ft", "pies": "ft",
    "meter": "m", "meters": "m", "metro": "m", "metros": "m",
    "gallon": "gal", "gallons": "gal", "galón": "gal", "galones": "gal",
    "liter": "l", "liters": "l", "litre": "l", "litres": "l", "litro": "l", "litros": "l",
    "kilogram": "kg", "kilograms": "kg", "kilogramo": "kg", "kilogramos": "kg",
    "pound": "lb", "pounds": "lb", "libra": "lb", "libras": "lb",
    # temperatura
    "celsius": "c", "grados celsius": "c", "grado celsius": "c", "°c": "c",
    "fahrenheit": "f", "grados fahrenheit": "f", "grado fahrenheit": "f", "°f": "f",
    "kelvin": "k", "kelvins": "k",
    # área
    "square meter": "m2", "square meters": "m2", "metro cuadrado": "m2", "metros cuadrados": "m2", "m²": "m2",
    "square foot": "ft2", "square feet": "ft2", "pie cuadrado": "ft2", "pies cuadrados": "ft2", "ft²": "ft2",
    "square centimeter": "cm2", "square centimeters": "cm2", "centímetro cuadrado": "cm2", "centímetros cuadrados": "cm2", "cm²": "cm2",
}

# conversiones lineales (factor multiplicador); temperatura usa función propia
_CONVERSIONS = {
    ("nm",     "km"):     1.852,
    ("km",     "nm"):     0.539957,
    ("knots",  "kmh"):    1.852,
    ("kmh",    "knots"):  0.539957,
    ("ft",     "m"):      0.3048,
    ("m",      "ft"):     3.28084,
    ("gal",    "l"):      3.78541,
    ("l",      "gal"):    0.264172,
    ("kg",     "lb"):     2.20462,
    ("lb",     "kg"):     0.453592,
    # área
    ("m2",     "ft2"):    10.7639,
    ("ft2",    "m2"):     0.092903,
    ("m2",     "cm2"):    10000,
    ("cm2",    "m2"):     0.0001,
    ("ft2",    "cm2"):    929.030,
    ("cm2",    "ft2"):    0.00107639,
}

# conversiones de temperatura (no lineales — función propia)
_TEMP_CONVERSIONS = {
    ("c", "f"): lambda v: v * 9 / 5 + 32,
    ("f", "c"): lambda v: (v - 32) * 5 / 9,
    ("c", "k"): lambda v: v + 273.15,
    ("k", "c"): lambda v: v - 273.15,
    ("f", "k"): lambda v: (v - 32) * 5 / 9 + 273.15,
    ("k", "f"): lambda v: (v - 273.15) * 9 / 5 + 32,
}

_UNIT_LABELS = {
    "nm": "NM", "km": "km", "knots": "nudos", "kmh": "km/h",
    "ft": "ft", "m": "m", "gal": "gal", "l": "L", "kg": "kg", "lb": "lb",
    "c": "°C", "f": "°F", "k": "K",
    "m2": "m²", "ft2": "ft²", "cm2": "cm²",
}


def _fmt(n, decimals: int = 2) -> str:
    # formato español: punto de miles, coma decimal
    if isinstance(n, Decimal):
        rounded = float(n.quantize(Decimal("0." + "0" * decimals), rounding=ROUND_HALF_UP))
    else:
        rounded = round(float(n), decimals)
    formatted = f"{rounded:,.{decimals}f}"
    return formatted.replace(",", "X").replace(".", ",").replace("X", ".")


def _fmt_result(n: float) -> str:
    # para calculate(): elimina ceros trailing, hasta 10 decimales
    if n == int(n) and abs(n) < 1e15:
        return _fmt(n, 0)
    s = f"{n:.10f}".rstrip("0").rstrip(",")
    # separador de miles con punto, decimal con coma
    parts = s.split(".")
    integer_part = f"{int(parts[0]):,}".replace(",", ".")
    decimal_part = parts[1] if len(parts) > 1 else ""
    return f"{integer_part},{decimal_part}" if decimal_part else integer_part


class Tools:
    class Valves(BaseModel):
        pass

    def __init__(self):
        self.valves = self.Valves()

    def calculate(self, expression: str) -> str:
        """
        Evaluates a safe arithmetic expression and returns the result.
        Supports: numbers, +, -, *, /, **, %, (, ), and math.* functions (sqrt, sin, cos, log, etc.).
        Examples: "1852 * 12", "(8500 * 3) + (2100 * 7)", "math.sqrt(144)", "100 * 1.21"
        :param expression: arithmetic expression as a string
        """
        # solo se permiten dígitos, operadores, paréntesis y funciones math.*
        if not re.match(r'^[\d\s\+\-\*\/\%\(\)\.\,\^mathsqrlogceifloorpiabsincotan]*$', expression):
            return f"Expresión no permitida: solo se aceptan números y operadores aritméticos."

        # coma → punto decimal, ^ → ** para compatibilidad con distintos formatos
        expr = expression.replace(",", ".").replace("^", "**")

        try:
            result = eval(expr, {"__builtins__": {}}, {"math": math})  # noqa: S307
        except ZeroDivisionError:
            return "Error: división por cero."
        except Exception as e:
            return f"Error en la expresión: {e}"

        if not isinstance(result, (int, float)):
            return "El resultado no es un número."
        if math.isnan(result) or math.isinf(result):
            return "El resultado es indefinido (NaN o infinito)."

        return _fmt_result(result)

    def convert(self, value: float, from_unit: str, to_unit: str) -> str:
        """
        Converts between nautical, common, temperature and area units.
        Supported: nm/km, knots/kmh, ft/m, gal/l, kg/lb, C/F/K, m2/ft2/cm2.
        Examples: convert(12, "nm", "km"), convert(25, "knots", "kmh"), convert(100, "c", "f"), convert(50, "m2", "ft2")
        :param value: numeric value to convert
        :param from_unit: source unit (accepts Spanish and English names)
        :param to_unit: target unit (accepts Spanish and English names)
        """
        f = _ALIASES.get(from_unit.lower().strip(), from_unit.lower().strip())
        t = _ALIASES.get(to_unit.lower().strip(), to_unit.lower().strip())

        f_label = _UNIT_LABELS.get(f, f)
        t_label = _UNIT_LABELS.get(t, t)

        # temperatura — conversión no lineal
        temp_fn = _TEMP_CONVERSIONS.get((f, t))
        if temp_fn is not None:
            result = temp_fn(value)
            return f"{_fmt(value, 2)} {f_label} = {_fmt(result, 2)} {t_label}"

        # conversión lineal
        factor = _CONVERSIONS.get((f, t))
        if factor is None:
            supported = ", ".join(f"{a}→{b}" for a, b in list(_CONVERSIONS) + list(_TEMP_CONVERSIONS))
            return f"Conversión no soportada: {from_unit} → {to_unit}. Disponibles: {supported}"

        result = value * factor
        decimals = 0 if t in ("ft", "lb") and result > 100 else 3
        return f"{_fmt(value, 3).rstrip('0').rstrip(',')} {f_label} = {_fmt(result, decimals)} {t_label}"

    def vat(self, amount: float, rate: float = 21.0, direction: str = "add") -> str:
        """
        Calculates VAT breakdown. Spanish IVA default is 21%.
        direction="add": price without VAT → price with VAT.
        direction="remove": price with VAT → base price (extract VAT).
        Examples: vat(8264.46, 21, "add"), vat(10000, 21, "remove"), vat(500, 10, "add")
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

    def margin(self, cost: float, price: float = None, margin_pct: float = None) -> str:
        """
        Calculates commercial margin. Two modes:
        - Given cost + price: returns margin % and profit.
        - Given cost + margin_pct: returns the selling price needed.
        Examples: margin(6000, price=8500), margin(6000, margin_pct=30)
        :param cost: unit cost in euros
        :param price: selling price in euros (optional)
        :param margin_pct: desired margin percentage (optional)
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
