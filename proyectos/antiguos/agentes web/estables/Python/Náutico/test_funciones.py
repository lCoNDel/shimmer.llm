import unittest
from unittest.mock import MagicMock
import sys
import importlib.util
import os

# --- 1. Mock 'geopy' BEFORE importing the module ---
# The module 'funciones.py' imports 'geopy.distance' and uses 'geodesic' at the top level.
# We must mock it so the import succeeds without 'geopy' installed and without errors.

# Create a mock for the 'geopy' package
mock_geopy = MagicMock()
sys.modules["geopy"] = mock_geopy

# Create a mock for 'geopy.distance' module
mock_geopy_distance = MagicMock()
sys.modules["geopy.distance"] = mock_geopy_distance

# Mock 'geodesic' function.
# It is called like: geodesic(coord1, coord2).kilometers
# So it needs to return an object that has a .kilometers attribute.
mock_distance_result = MagicMock()
mock_distance_result.kilometers = 100.0 # Return a dummy distance
mock_geopy_distance.geodesic.return_value = mock_distance_result

# Also mock 'distance' function which is imported inside 'calcular_nueva_posicion'
mock_geopy_distance.distance.return_value = mock_distance_result

# --- 2. Dynamically import 'funciones.py' ---
# The path contains spaces, so we use importlib.

# Construct the absolute path to the file
current_dir = os.path.dirname(os.path.abspath(__file__))
module_path = os.path.join(current_dir, "funciones.py")
module_name = "funciones"

spec = importlib.util.spec_from_file_location(module_name, module_path)
funciones = importlib.util.module_from_spec(spec)
sys.modules[module_name] = funciones
spec.loader.exec_module(funciones)


# --- 3. Define Test Cases ---

class TestCalcularCapacidadCarga(unittest.TestCase):

    def test_sobrecarga(self):
        """Test that overloading returns the correct message."""
        # Case: Current weight > Max weight
        peso_actual = 15.0
        peso_maximo = 10.0
        resultado = funciones.calcular_capacidad_carga(peso_actual, peso_maximo)
        self.assertEqual(resultado, "El barco está sobrecargado.")

    def test_capacidad_suficiente(self):
        """Test that being under capacity returns the correct message."""
        # Case: Current weight < Max weight
        peso_actual = 5.0
        peso_maximo = 10.0
        resultado = funciones.calcular_capacidad_carga(peso_actual, peso_maximo)
        self.assertEqual(resultado, "El barco tiene capacidad suficiente para la carga.")

    def test_limite(self):
        """Test that being exactly at capacity returns the correct message."""
        # Case: Current weight == Max weight
        peso_actual = 10.0
        peso_maximo = 10.0
        resultado = funciones.calcular_capacidad_carga(peso_actual, peso_maximo)
        self.assertEqual(resultado, "El barco tiene capacidad suficiente para la carga.")

if __name__ == '__main__':
    unittest.main()
