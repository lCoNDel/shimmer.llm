"""
Script de generación de datos ficticios para la demo ERP-IA de Touron S.A.
Simula exportaciones de tablas Oracle: productos, ventas, stock (2020-2025).
Ejecutar una vez en el host: python generar_datos.py
"""

import csv
import math
import os

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ──────────────────────────────────────────────────────────────────────────────
# CATÁLOGO
# ──────────────────────────────────────────────────────────────────────────────

PRODUCTOS = [
    # Lubricantes
    ("MRC-4T-1L",    "Aceite Mercury 4T SAE 10W-30 1L",                "Lubricantes",    9.20,   11.20,  17.9),
    ("MRC-4T-4L",    "Aceite Mercury 4T SAE 10W-30 4L",                "Lubricantes",   32.00,   39.00,  17.9),
    ("MRC-4T-25L",   "Aceite Mercury 4T SAE 10W-30 25L",               "Lubricantes",  185.00,  225.00,  17.8),
    ("MRC-2T-1L",    "Aceite Mercury 2T TCW-3 1L",                     "Lubricantes",    7.80,    9.80,  20.4),
    ("QSV-HPS-1L",   "QuickSilver High Performance Gear Lube 1L",      "Lubricantes",   11.50,   14.90,  22.8),
    ("QSV-PST-200",  "QuickSilver Power Steering Fluid 200ml",         "Lubricantes",    5.20,    7.50,  30.7),
    ("QSV-ANF-1L",   "QuickSilver Antifreeze Coolant 1L",              "Lubricantes",    4.80,    6.80,  29.4),
    ("MRC-DFI-4L",   "Aceite Mercury DFI 2T 4L",                      "Lubricantes",   38.00,   46.00,  17.4),
    # Filtros
    ("MRC-FLT-OIL",  "Filtro Aceite Mercury 4T 35-8M0065103",          "Filtros",        6.80,    9.50,  28.4),
    ("MRC-FLT-FUEL", "Filtro Combustible Mercury 35-8M0018476",        "Filtros",        4.20,    6.20,  32.3),
    ("MRC-FLT-WTR",  "Filtro Agua Cruda Mercury 35-8M0113864",         "Filtros",        5.50,    7.80,  29.5),
    ("QSV-WSEP",     "QuickSilver Water Separating Fuel Filter",       "Filtros",        8.90,   12.50,  28.8),
    ("SIR-FLT-FUE",  "Filtro Combustible Sierra 18-7905",              "Filtros",        3.80,    5.90,  35.6),
    ("SIR-WFLT",     "Filtro Agua Dulce Sierra 18-3491",               "Filtros",        7.20,   10.80,  33.3),
    # Impulsores
    ("JAB-18590",    'Impulsor Jabsco 18590-0001 (1-1/4")',            "Impulsores",    18.50,   27.00,  31.5),
    ("JAB-17937",    "Impulsor Jabsco 17937-0001",                     "Impulsores",   14.20,   21.00,  32.4),
    ("JAB-6303",     "Impulsor Jabsco 6303-0003",                      "Impulsores",   22.50,   33.00,  31.8),
    ("SIR-IMP-18",   "Impulsor Sierra 18-3082",                        "Impulsores",   11.80,   17.50,  32.6),
    ("SIR-IMP-MRC",  "Impulsor Sierra 18-3214 Mercury 40-125HP",       "Impulsores",   13.50,   19.80,  31.8),
    ("SIR-IMP-VOL",  "Impulsor Sierra 18-3086 Volvo Penta",            "Impulsores",   15.20,   22.50,  32.4),
    # Ánodos
    ("AZN-MRC75",    "Anodo Zinc Mercury 75-90HP 97-826134Q3",         "Anodos",         6.80,   10.50,  35.2),
    ("AZN-MRC150",   "Anodo Zinc Mercury 115-150HP 97-826133Q3",       "Anodos",         8.20,   12.80,  35.9),
    ("AZN-TAB40",    "Anodo Zinc Tablilla Mercury 40-60HP",            "Anodos",         4.50,    7.20,  37.5),
    ("AMG-MRC75",    "Anodo Magnesio Mercury 75-90HP",                 "Anodos",         9.50,   14.80,  35.8),
    ("AZN-CASC",     "Anodo Zinc Casco Universal 2kg",                 "Anodos",        12.40,   19.50,  36.4),
    # Hélices
    ("HLC-MRC-B1",   "Helice Mercury BlackMax 10.5x13 3P Aluminio",    "Helices",       68.00,   95.00,  28.4),
    ("HLC-MRC-B2",   "Helice Mercury BlackMax 13x19 3P Aluminio",      "Helices",       75.00,  108.00,  30.6),
    ("HLC-MRC-B3",   "Helice Mercury BlackMax 15x17 3P Aluminio",      "Helices",       72.00,  102.00,  29.4),
    ("HLC-MRC-SS1",  "Helice Mercury Enertia 14x19 3P Inox",           "Helices",      195.00,  280.00,  30.4),
    ("HLC-MRC-SS2",  "Helice Mercury Bravo 15.5x21 3P Inox",           "Helices",      310.00,  445.00,  30.3),
    # Refrigeración
    ("MRC-TSTAT",    "Termostato Mercury 75-90HP 17286A2",             "Refrigeracion", 12.80,   19.50,  34.4),
    ("MRC-TBOMBA",   "Tapa Bomba Agua Mercury 200-225HP 817275A1",     "Refrigeracion", 22.50,   34.00,  33.8),
    ("SIR-KIT-WP",   "Kit Revision Bomba Agua Sierra 18-3214",         "Refrigeracion", 28.50,   42.00,  32.1),
    ("MRC-KIT-WP",   "Kit Revision Bomba Agua Mercury 8M0100526",      "Refrigeracion", 35.00,   52.00,  32.7),
    # Electrónica
    ("SIM-GO9XSE",   "Simrad GO9 XSE Multifuncion + Sonda HDI",        "Electronica",  680.00,  895.00,  24.0),
    ("SIM-GO12XSE",  "Simrad GO12 XSE Multifuncion + Sonda HDI",       "Electronica",  920.00, 1190.00,  22.7),
    ("SIM-NSS9",     "Simrad NSS9 evo3S Multifuncion",                 "Electronica", 1150.00, 1490.00,  22.8),
    ("SIM-NSS12",    "Simrad NSS12 evo3S Multifuncion",                "Electronica", 1480.00, 1920.00,  22.9),
    ("SIM-VHF-RS35", "VHF Fijo Simrad RS35 DSC + AIS",                 "Electronica",  195.00,  265.00,  26.4),
    # Transmisión
    ("MRC-BLTALT",   "Correa Alternador Mercury 200-250HP 57-8M0148985","Transmision",  18.50,   28.00,  33.9),
    ("MRC-BLTPS",    "Correa Power Steering Mercury Verado 4L",        "Transmision",   14.80,   22.50,  34.2),
    ("MRC-ACPR",     "Kit Pasamuros Mercury 4T 25-8M0060321",          "Transmision",    9.20,   14.50,  36.6),
    # Mantenimiento
    ("QSV-EC",       "QuickSilver Engine Cleaner Spray 400ml",         "Mantenimiento",  4.20,    6.90,  39.1),
    ("MRC-KIT-STR",  "Kit Arranque Emergencia Mercury 8M0097859",      "Mantenimiento", 22.00,   34.00,  35.3),
    ("MRC-SPARK",    "Bujia NGK BPZ8HS-10 Mercury (pack 4u)",         "Mantenimiento",  8.50,   13.50,  37.0),
    ("SIR-CRANK",    "Sensor Ciguenyal Sierra 18-5911",                "Mantenimiento", 32.00,   48.00,  33.3),
    ("JAB-KIT-SRV",  "Kit Mantenimiento Bomba Jabsco Par-Mak 6 GPM",  "Mantenimiento", 45.00,   68.00,  33.8),
    ("MRC-ANODE-KT", "Kit Anodos Revision Motor Mercury 150HP",        "Mantenimiento", 38.00,   57.00,  33.3),
    ("SIR-BELT-KT",  "Kit Correas Sierra Mercury 4.3L V6",             "Mantenimiento", 24.50,   37.00,  33.8),
    ("MRC-IMPKIT",   "Kit Impulsor + Junta Mercury 40-60HP",           "Mantenimiento", 32.00,   48.50,  34.0),
    ("SIR-TSTAT-KT", "Kit Termostato + Junta Sierra 18-3672",          "Mantenimiento", 14.80,   22.00,  32.7),
]

# ──────────────────────────────────────────────────────────────────────────────
# CONFIG VENTAS Y STOCK
# ──────────────────────────────────────────────────────────────────────────────

_S_FLAT   = [1.00]*12
_S_MAINT  = [0.88,0.82,0.98,1.08,1.15,1.22,1.18,1.12,1.06,1.00,0.88,0.82]
_S_SUMMER = [0.55,0.52,0.78,1.02,1.32,1.62,1.72,1.60,1.18,0.82,0.60,0.52]
_S_ELEC   = [1.08,0.98,1.08,1.18,1.08,0.88,0.80,0.88,1.08,1.22,1.12,1.12]

_VCFG = {
    "MRC-4T-1L":    (22, 0.18, _S_MAINT),
    "MRC-4T-4L":    (8,  0.15, _S_MAINT),
    "MRC-4T-25L":   (2,  0.10, _S_MAINT),
    "MRC-2T-1L":    (15, 0.04, _S_SUMMER),
    "QSV-HPS-1L":   (7,  0.06, _S_MAINT),
    "QSV-PST-200":  (5,  0.05, _S_FLAT),
    "QSV-ANF-1L":   (9,  0.04, _S_FLAT),
    "MRC-DFI-4L":   (4,  0.08, _S_SUMMER),
    "MRC-FLT-OIL":  (18, 0.10, _S_MAINT),
    "MRC-FLT-FUEL": (12, 0.08, _S_MAINT),
    "MRC-FLT-WTR":  (10, 0.07, _S_MAINT),
    "QSV-WSEP":     (8,  0.08, _S_MAINT),
    "SIR-FLT-FUE":  (6,  0.06, _S_MAINT),
    "SIR-WFLT":     (5,  0.05, _S_MAINT),
    "JAB-18590":    (8,  0.08, _S_MAINT),
    "JAB-17937":    (6,  0.06, _S_MAINT),
    "JAB-6303":     (4,  0.05, _S_MAINT),
    "SIR-IMP-18":   (5,  0.05, _S_MAINT),
    "SIR-IMP-MRC":  (7,  0.07, _S_MAINT),
    "SIR-IMP-VOL":  (4,  0.04, _S_MAINT),
    "AZN-MRC75":    (12, 0.05, _S_SUMMER),
    "AZN-MRC150":   (9,  0.05, _S_SUMMER),
    "AZN-TAB40":    (11, 0.04, _S_SUMMER),
    "AMG-MRC75":    (5,  0.06, _S_SUMMER),
    "AZN-CASC":     (4,  0.04, _S_SUMMER),
    "HLC-MRC-B1":   (4,  0.06, _S_SUMMER),
    "HLC-MRC-B2":   (3,  0.05, _S_SUMMER),
    "HLC-MRC-B3":   (3,  0.05, _S_SUMMER),
    "HLC-MRC-SS1":  (2,  0.07, _S_SUMMER),
    "HLC-MRC-SS2":  (1,  0.06, _S_SUMMER),
    "MRC-TSTAT":    (8,  0.06, _S_MAINT),
    "MRC-TBOMBA":   (4,  0.05, _S_MAINT),
    "SIR-KIT-WP":   (6,  0.06, _S_MAINT),
    "MRC-KIT-WP":   (5,  0.06, _S_MAINT),
    "SIM-GO9XSE":   (3,  0.14, _S_ELEC),
    "SIM-GO12XSE":  (2,  0.12, _S_ELEC),
    "SIM-NSS9":     (2,  0.05, _S_ELEC),
    "SIM-NSS12":    (1,  0.18, _S_ELEC),
    "SIM-VHF-RS35": (4,  0.08, _S_ELEC),
    "MRC-BLTALT":   (6,  0.06, _S_MAINT),
    "MRC-BLTPS":    (4,  0.05, _S_MAINT),
    "MRC-ACPR":     (8,  0.07, _S_MAINT),
    "QSV-EC":       (10, 0.08, _S_MAINT),
    "MRC-KIT-STR":  (3,  0.05, _S_FLAT),
    "MRC-SPARK":    (12, 0.06, _S_MAINT),
    "SIR-CRANK":    (2,  0.04, _S_FLAT),
    "JAB-KIT-SRV":  (3,  0.05, _S_MAINT),
    "MRC-ANODE-KT": (6,  0.05, _S_SUMMER),
    "SIR-BELT-KT":  (4,  0.05, _S_MAINT),
    "MRC-IMPKIT":   (5,  0.06, _S_MAINT),
    "SIR-TSTAT-KT": (4,  0.05, _S_MAINT),
}

# Stock override por año/mes para los escenarios de demo
_SKOV = {
    "JAB-18590": {
        "2020": [5,4,5,3,3,2,2,3,4,3,3,4],
        "2021": [3,2,2,2,1,1,2,2,3,2,2,3],
        "2022": [3,4,5,6,8,8,9,10,11,12,13,14],
    },
    "SIM-NSS9": {
        "2021": [8,8,9,8,9,8,9,8,9,8,8,9],
        "2022": [9,8,9,8,9,8,9,9,8,8,9,8],
        "2023": [8,8,9,8,8,8,9,8,8,8,9,8],
        "2024": [8,7,7,6,6,6,6,6,6,6,6,6],
        "2025": [6,6,6,6,6,6,6,6,6,6,6,6],
    },
}


def _noise(cod, year, month):
    n = (sum(ord(c) for c in cod) * 7 + year * 13 + month * 31) % 100
    return (n - 50) / 650


def main():
    prod_map = {p[0]: p for p in PRODUCTOS}

    # ── productos.csv ────────────────────────────────────────────────────────
    with open(os.path.join(OUT_DIR, "productos.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["cod", "nombre", "categoria", "precio_compra", "precio_venta", "margen_pct"])
        for p in PRODUCTOS:
            w.writerow([p[0], p[1], p[2], f"{p[3]:.2f}", f"{p[4]:.2f}", f"{p[5]:.1f}"])
    print(f"productos.csv — {len(PRODUCTOS)} filas")

    # ── ventas.csv y stock.csv ───────────────────────────────────────────────
    vf = open(os.path.join(OUT_DIR, "ventas.csv"), "w", newline="", encoding="utf-8")
    sf = open(os.path.join(OUT_DIR, "stock.csv"),  "w", newline="", encoding="utf-8")
    vw = csv.writer(vf, delimiter=";")
    sw = csv.writer(sf, delimiter=";")
    vw.writerow(["fecha", "cod_producto", "unidades", "precio_real"])
    sw.writerow(["fecha", "cod_producto", "stock_disponible"])

    v_count = s_count = 0

    for prod in PRODUCTOS:
        cod = prod[0]
        pv_base = prod[4]
        base, gr, season = _VCFG.get(cod, (4, 0.04, _S_MAINT))
        stk_base_default = max(8, base * 3)
        skov = _SKOV.get(cod, {})

        for year in range(2020, 2026):
            yr_ov = skov.get(str(year))

            for month in range(1, 13):
                fecha = f"{year}-{month:02d}"
                n_v = _noise(cod, year, month)
                yr_f = (1 + gr) ** (year - 2020)
                sea  = season[month - 1]
                uds  = max(0, round(base * yr_f * sea * (1 + n_v)))

                # Demo escenario 3: SIM-NSS9 sin ventas desde 2025-05
                if cod == "SIM-NSS9":
                    if year == 2024 and month >= 9:
                        uds = max(0, uds - 2)
                    if year == 2025 and month >= 5:
                        uds = 0

                # Stock
                if yr_ov:
                    stk = yr_ov[month - 1]
                else:
                    n_s = _noise(cod, year + 1, month + 6)
                    stk = max(0, round(stk_base_default * (1 + 0.02 * (year - 2020)) * (1 + n_s * 0.12)))

                # Demo escenario 2: JAB-18590 ventas limitadas por stock bajo
                if cod == "JAB-18590" and year <= 2022:
                    uds = min(uds, max(0, stk - 1))

                precio_real = round(pv_base * (1 + 0.014 * (year - 2020)), 2)
                vw.writerow([fecha, cod, uds, f"{precio_real:.2f}"])
                sw.writerow([fecha, cod, stk])
                v_count += 1
                s_count += 1

    vf.close()
    sf.close()
    print(f"ventas.csv  — {v_count} filas")
    print(f"stock.csv   — {s_count} filas")
    print("Listo.")


if __name__ == "__main__":
    main()
