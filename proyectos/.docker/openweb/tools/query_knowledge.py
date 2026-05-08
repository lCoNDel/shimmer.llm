"""
title: Knowledge Search
author: shimmer
description: Busca en todas las bases de conocimiento disponibles usando búsqueda híbrida (semántica + BM25). Lanza dos queries —una en español y otra en inglés— de forma secuencial para maximizar la cobertura de resultados.
version: 9.0.0
requirements:
"""

import asyncio
import logging
import re
from typing import Callable, Any

log = logging.getLogger(__name__)

COUNT = 15
COLLECTION_IDS = [
    "ea80e4f0-ac8a-49c5-8025-9b7dc1ee763e",  # Manuales Mercury
    "245f2ffa-13ce-4c98-97fa-a6d2efdcf885",  # G3
]


class Tools:
    def __init__(self):
        pass

    async def query_knowledge(
        self,
        query_es: str,
        query_en: str,
        __request__=None,
        __user__: dict = {},
        __event_emitter__: Callable[[Any], None] = None,
    ) -> str:
        """
        Busca información en las bases de conocimiento. SIEMPRE llama a esta herramienta antes de responder preguntas técnicas sobre motores, mantenimiento, repuestos, manuales o productos.
        Lanza dos búsquedas para maximizar resultados. No llames a ninguna otra herramienta de conocimiento.

        :param query_es: Consulta de búsqueda en español. Debe ser corta y precisa (3-6 palabras clave).
        :param query_en: La misma consulta traducida al inglés. Debe ser corta y precisa (3-6 palabras clave).
        :return: Chunks de texto relevantes encontrados en las bases de conocimiento.
        """
        if __request__ is None:
            return "Error: contexto de request no disponible."

        try:
            from open_webui.retrieval.utils import query_collection

            embedding_function = __request__.app.state.EMBEDDING_FUNCTION
            if not embedding_function:
                return "Error: función de embeddings no configurada."

            log.info(f"[query_knowledge] ES='{query_es}' EN='{query_en}'")

            results_es = await query_collection(
                __request__,
                collection_names=COLLECTION_IDS,
                queries=[query_es],
                embedding_function=embedding_function,
                k=COUNT,
            )

            results_en = await query_collection(
                __request__,
                collection_names=COLLECTION_IDS,
                queries=[query_en],
                embedding_function=embedding_function,
                k=COUNT,
            )

            seen = set()
            chunks = []
            for query_results in (results_es, results_en):
                if not query_results or "documents" not in query_results:
                    continue
                documents = query_results.get("documents", [[]])[0]
                metadatas = query_results.get("metadatas", [[]])[0]
                for doc, meta in zip(documents, metadatas):
                    doc = re.sub(r'Filename:.*?(?=\n|$)', '', doc, flags=re.IGNORECASE).strip()
                    doc = re.sub(r'Title:.*?(?=\n|$)', '', doc, flags=re.IGNORECASE).strip()
                    doc = re.sub(r'Source:.*?(?=\n|$)', '', doc, flags=re.IGNORECASE).strip()
                    doc = re.sub(r'\n{3,}', '\n\n', doc).strip()
                    key = doc[:120]
                    if key not in seen:
                        seen.add(key)
                        chunks.append({
                            "text": doc,
                            "source": meta.get("name", meta.get("source", "Desconocido")),
                            "page": meta.get("page_label", meta.get("page", "")),
                        })

            if not chunks:
                return "No se encontraron resultados relevantes en las bases de conocimiento."

            log.info(f"[query_knowledge] {len(chunks)} chunks devueltos")

            lines = []
            for i, c in enumerate(chunks, 1):
                page_str = f" (p. {c['page']})" if c.get("page") else ""
                lines.append(f"[{i}] {c['source']}{page_str}:\n{c['text']}")

            seen_sources = set()
            sources = []
            for c in chunks:
                key = (c["source"], c["page"])
                if key not in seen_sources:
                    seen_sources.add(key)
                    page_str = f" (p. {c['page']})" if c.get("page") else ""
                    sources.append(f"📄 {c['source']}{page_str}")

            footer = "\n\n---\nAL FINAL DE TU RESPUESTA CITA OBLIGATORIAMENTE:\n" + "\n".join(sources)

            return "\n\n".join(lines) + footer

        except Exception as e:
            log.exception(f"[query_knowledge] Error: {e}")
            return f"Error: {e}"
