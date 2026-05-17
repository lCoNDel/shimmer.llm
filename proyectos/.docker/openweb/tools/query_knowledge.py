"""
title: Knowledge Search
author: Luis Conde
description: Busca en todas las bases de conocimiento disponibles usando busqueda hibrida (semantica + BM25). Llamar dos veces por pregunta: una en espanol y otra en ingles.
version: 1.2.0
requirements:
"""

import logging
import re
import httpx
from typing import Callable, Any

log = logging.getLogger(__name__)

COUNT = 15
MIN_CHUNK_CHARS = 150  # chunks con menos caracteres son portadas, índices o páginas en blanco
KB_ID = "68e000dc-79a8-4b0f-a74d-eb9f63ce1b92"  # Manuales Mercury
COLLECTION_IDS = [KB_ID]


class Tools:
    def __init__(self):
        pass

    async def query_knowledge(
        self,
        query: str,
        file_filter: str = "",
        __request__=None,
        __user__: dict = {},
        __event_emitter__: Callable[[Any], None] = None,
    ) -> str:
        """
        Busca informacion en las bases de conocimiento. SIEMPRE llama a esta herramienta antes de responder preguntas tecnicas sobre motores, mantenimiento, repuestos, manuales o productos.
        Llamar DOS veces por pregunta: primero con la query en espanol, luego con la query en ingles.

        :param query: Query de busqueda, 3-6 palabras clave. Sin frases completas ni palabras de relleno.
        :param file_filter: Opcional. Si el usuario menciona explicitamente un archivo ("busca en el Verado V12", "solo en el 400R"), extraer el nombre y pasarlo aqui. Si la pregunta es general, omitir.
        :return: Chunks relevantes de las bases de conocimiento.
        """
        if __request__ is None:
            return "Error: contexto de request no disponible."

        try:
            from open_webui.retrieval.utils import query_collection

            embedding_function = __request__.app.state.EMBEDDING_FUNCTION
            if not embedding_function:
                return "Error: funcion de embeddings no configurada."

            collection_ids = COLLECTION_IDS

            if file_filter:
                base_url = str(__request__.base_url).rstrip("/")
                token = __user__.get("token", "")
                headers = {"Authorization": f"Bearer {token}"}
                try:
                    resp = httpx.get(
                        f"{base_url}/api/v1/knowledge/{KB_ID}/files",
                        headers=headers,
                        timeout=10,
                    )
                    files = resp.json().get("files", [])
                    match = next(
                        (f for f in files if file_filter.lower() in f.get("name", "").lower()),
                        None,
                    )
                    if match:
                        collection_ids = [f"file-{match['id']}"]
                        log.info(f"[query_knowledge] file_filter='{file_filter}' -> {collection_ids[0]}")
                    else:
                        available = ", ".join(f.get("name", "") for f in files)
                        return f"No se encontro ningun archivo que coincida con '{file_filter}'. Archivos disponibles: {available}"
                except Exception as e:
                    log.warning(f"[query_knowledge] Error resolviendo file_filter: {e}. Usando KB completa.")

            log.info(f"[query_knowledge] query='{query}' collections={collection_ids}")

            results = await query_collection(
                __request__,
                collection_names=collection_ids,
                queries=[query],
                embedding_function=embedding_function,
                k=COUNT,
            )

            if not results or "documents" not in results:
                return "No se encontraron resultados relevantes en las bases de conocimiento."

            documents = results.get("documents", [[]])[0]
            metadatas = results.get("metadatas", [[]])[0]
            distances = results.get("distances", [[]])[0]

            chunks = []
            for idx, (doc, meta) in enumerate(zip(documents, metadatas)):
                doc = re.sub(r'Filename:.*?(?=\n|$)', '', doc, flags=re.IGNORECASE).strip()
                doc = re.sub(r'Title:.*?(?=\n|$)', '', doc, flags=re.IGNORECASE).strip()
                doc = re.sub(r'Source:.*?(?=\n|$)', '', doc, flags=re.IGNORECASE).strip()
                doc = re.sub(r'\n{3,}', '\n\n', doc).strip()
                if len(doc) < MIN_CHUNK_CHARS:
                    log.info(f"[query_knowledge] chunk descartado (muy corto, {len(doc)} chars): p. {meta.get('page_label', meta.get('page', '?'))}")
                    continue
                if re.search(r'\.{10,}', doc):
                    log.info(f"[query_knowledge] chunk descartado (índice): p. {meta.get('page_label', meta.get('page', '?'))}")
                    continue
                score = distances[idx] if idx < len(distances) else None
                chunks.append({
                    "text": doc,
                    "source": meta.get("name", meta.get("source", "Desconocido")),
                    "page": meta.get("page_label", meta.get("page", "")),
                    "score": score,
                })

            if not chunks:
                return "No se encontraron resultados relevantes en las bases de conocimiento."

            log.info(f"[query_knowledge] query='{query}' -> {len(chunks)} chunks")

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
                    score_str = f" [score: {c['score']:.3f}]" if c.get("score") is not None else ""
                    sources.append(f"📄 {c['source']}{page_str}{score_str}")

            footer = "\n\n---\nFuentes consultadas (incluir al final de la respuesta):\n" + "\n".join(sources)

            return "\n\n".join(lines) + footer

        except Exception as e:
            log.exception(f"[query_knowledge] Error: {e}")
            return f"Error: {e}"
