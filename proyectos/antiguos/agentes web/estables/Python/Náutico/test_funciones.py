import sys
import unittest
from unittest.mock import MagicMock
import os

# Mock geopy before importing funciones
# This is necessary because the environment lacks internet access and third-party dependencies like geopy.
# We must mock it before importing the target module to prevent ImportError.
mock_geopy = MagicMock()
sys.modules['geopy'] = mock_geopy
mock_distance = MagicMock()
sys.modules['geopy.distance'] = mock_distance

# Configure the mock to return a value with .kilometers attribute
# We need to ensure that when `geodesic(coord1, coord2)` is called, it returns something with .kilometers
mock_geodesic = MagicMock()
mock_result = MagicMock()
mock_result.kilometers = 100.0  # arbitrary valid float
mock_geodesic.return_value = mock_result
mock_distance.geodesic = mock_geodesic

# Ensure the module can be imported by adding its directory to sys.path
# Use the directory where this file resides to correctly locate funciones.py
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

import funciones

class TestCalcularVelocidadPromedio(unittest.TestCase):
    def test_calcular_velocidad_promedio_valid(self):
        """Test with valid positive inputs."""
        # 100 km in 2 hours = 50 km/h
        self.assertAlmostEqual(funciones.calcular_velocidad_promedio(100, 2), 50.0)
        # 100.5 km in 2.5 hours = 40.2 km/h
        self.assertAlmostEqual(funciones.calcular_velocidad_promedio(100.5, 2.5), 40.2)

    def test_calcular_velocidad_promedio_zero_time(self):
        """Test that zero time raises ValueError."""
        with self.assertRaises(ValueError):
            funciones.calcular_velocidad_promedio(100, 0)

    def test_calcular_velocidad_promedio_negative_time(self):
        """Test that negative time raises ValueError."""
        with self.assertRaises(ValueError):
            funciones.calcular_velocidad_promedio(100, -5)

    def test_calcular_velocidad_promedio_zero_distance(self):
        """Test that zero distance returns zero speed."""
        self.assertAlmostEqual(funciones.calcular_velocidad_promedio(0, 2), 0.0)

if __name__ == '__main__':
    unittest.main()
