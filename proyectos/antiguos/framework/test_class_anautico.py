
import sys
import os
import unittest
from unittest.mock import MagicMock, patch

# Set dummy API key to prevent OpenAIError during import
os.environ["OPENAI_API_KEY"] = "dummy"

import openai

import class_anáutico

class TestChatWithGPT(unittest.TestCase):

    @patch('openai.chat.completions.create')
    def test_generic_exception_raises(self, mock_create):
        # Simulate a generic exception (like ValueError)
        mock_create.side_effect = ValueError("This is a generic error")

        # Verify it raises ValueError (not caught)
        with self.assertRaises(ValueError):
            class_anáutico.chat_with_gpt("test")

    @patch('openai.chat.completions.create')
    def test_openai_api_error_caught(self, mock_create):
        # Simulate an OpenAI APIError
        mock_create.side_effect = openai.APIError("OpenAI Error", request=None, body={})

        response = class_anáutico.chat_with_gpt("test")

        # Verify it was caught and returned the specific error message
        self.assertTrue("Error de la API de OpenAI" in response)

    @patch('openai.chat.completions.create')
    def test_openai_connection_error_caught(self, mock_create):
        # Simulate an OpenAI APIConnectionError
        mock_create.side_effect = openai.APIConnectionError(message="Connection Failed", request=None)

        response = class_anáutico.chat_with_gpt("test")

        # Verify it was caught and returned the specific error message
        self.assertTrue("Error: No se pudo conectar" in response)

    @patch('openai.chat.completions.create')
    def test_openai_ratelimit_error_caught(self, mock_create):
        # Simulate an OpenAI RateLimitError
        mock_create.side_effect = openai.RateLimitError("Rate Limit Exceeded", response=MagicMock(), body={})

        response = class_anáutico.chat_with_gpt("test")

        # Verify it was caught and returned the specific error message
        self.assertTrue("Error: Has excedido tu límite" in response)

if __name__ == '__main__':
    unittest.main()
