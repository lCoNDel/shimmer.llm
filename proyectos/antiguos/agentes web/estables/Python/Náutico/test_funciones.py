import unittest
import importlib.util
import sys
import os

# Path to the file to be tested
# Using os.path to handle potential path issues, though relative path from current working directory is expected to be correct if run from root.
file_path = os.path.join(os.path.dirname(__file__), 'funciones.py')

# Dynamic import due to spaces in directory names
spec = importlib.util.spec_from_file_location("funciones", file_path)
funciones = importlib.util.module_from_spec(spec)
sys.modules["funciones"] = funciones
spec.loader.exec_module(funciones)

class TestFunciones(unittest.TestCase):

    def test_convertir_distancia(self):
        """
        Test the convertir_distancia function.
        1 nautical mile = 1.852 km
        """
        # Test case 1: 1 nautical mile
        self.assertAlmostEqual(funciones.convertir_distancia(1), 1.852, places=3)

        # Test case 2: 10 nautical miles
        self.assertAlmostEqual(funciones.convertir_distancia(10), 18.52, places=3)

        # Test case 3: 0 nautical miles
        self.assertAlmostEqual(funciones.convertir_distancia(0), 0, places=3)

        # Test case 4: Negative value (mathematically correct, though physically impossible distance)
        self.assertAlmostEqual(funciones.convertir_distancia(-1), -1.852, places=3)

        # Test case 5: Floating point input
        self.assertAlmostEqual(funciones.convertir_distancia(2.5), 4.63, places=3)

if __name__ == '__main__':
    unittest.main()
