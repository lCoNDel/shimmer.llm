"""
title: Knowledge Search
author: Luis Conde
description: Busca en las bases de conocimiento con busqueda hibrida (semantica + BM25). Multi-KB configurable o autodescubierta, busqueda bilingue es/en en una sola llamada, filtro por archivo, citas nativas en la interfaz y listado de KB y archivos para agentes.
version: 2.0.0
requirements:
"""

import logging
import re
from typing import Any, Callable

import httpx
from pydantic import BaseModel, Field

log = logging.getLogger(__name__)

DEFAULT_KB_IDS = "68e000dc-79a8-4b0f-a74d-eb9f63ce1b92"  # Manuales Mercury


def _clean_chunk(doc: str) -> str:
    doc = re.sub(r"Filename:.*?(?=\n|$)", "", doc, flags=re.IGNORECASE)
    doc = re.sub(r"Title:.*?(?=\n|$)", "", doc, flags=re.IGNORECASE)
    doc = re.sub(r"Source:.*?(?=\n|$)", "", doc, flags=re.IGNORECASE)
    return re.sub(r"\n{3,}", "\n\n", doc).strip()


def _file_name(f: dict) -> str:
    return f.get("name") or f.get("filename") or (f.get("meta") or {}).get("name", "") or ""


class Tools:
    class Valves(BaseModel):
        KNOWLEDGE_IDS: str = Field(
            default=DEFAULT_KB_IDS,
            description="IDs de knowledge bases separadas por coma. Vacio = autodescubrir todas las KB accesibles para el usuario.",
        )
        TOP_K: int = Field(default=15, description="Chunks a recuperar por query.")
        MAX_TOTAL_CHUNKS: int = Field(
            default=20, description="Maximo de chunks devueltos al modelo tras filtrar y deduplicar."
        )
        MIN_CHUNK_CHARS: int = Field(
            default=150, description="Descarta chunks mas cortos (portadas, indices, paginas en blanco)."
        )
        MAX_FILE_MATCHES: int = Field(
            default=5, description="Maximo de archivos a usar cuando file_filter coincide con varios."
        )
        EMIT_CITATIONS: bool = Field(
            default=True, description="Emite citas nativas de Open WebUI (fuentes clicables en el chat)."
        )
        EMIT_STATUS: bool = Field(default=True, description="Muestra el progreso de la busqueda en la interfaz.")

    def __init__(self):
        self.valves = self.Valves()
        # las citas se emiten manualmente via __event_emitter__; True las duplicaria
        self.citation = False

    # ── Tool 1: busqueda ───────────────────────────────────────────────────────

    async def query_knowledge(
        self,
        query: str,
        query_en: str = "",
        file_filter: str = "",
        __request__=None,
        __user__: dict = {},
        __event_emitter__: Callable[[Any], None] = None,
    ) -> str:
        """
        Busca informacion en las bases de conocimiento. SIEMPRE llama a esta herramienta
        antes de responder preguntas tecnicas sobre motores, mantenimiento, repuestos,
        manuales o productos. Pasa la query en espanol y su traduccion al ingles en
        query_en: se busca en ambos idiomas en una sola llamada.

        :param query: Query de busqueda en espanol, 3-6 palabras clave. Sin frases completas ni palabras de relleno.
        :param query_en: La misma query traducida al ingles (muy recomendado: la mayoria de manuales estan en ingles).
        :param file_filter: Opcional. Si el usuario menciona un archivo o modelo concreto ("busca en el Verado V12", "solo el 400R"), pasar ese texto; se busca solo en los archivos cuyo nombre coincida.
        :return: Fragmentos relevantes con su fuente y pagina.
        """
        if __request__ is None:
            return "Error: contexto de request no disponible."
        if not isinstance(query, str) or not query.strip():
            return "Error: query vacia."

        try:
            from open_webui.retrieval.utils import query_collection

            embedding_function = __request__.app.state.EMBEDDING_FUNCTION
            if not embedding_function:
                return "Error: funcion de embeddings no configurada."

            kbs = await self._get_knowledge_bases(__request__, __user__)
            if not kbs:
                return (
                    "No hay bases de conocimiento disponibles. "
                    "Configura KNOWLEDGE_IDS en las Valves de la tool o da acceso al usuario a alguna KB."
                )

            collection_ids = [kb["id"] for kb in kbs]
            scope = f"{len(kbs)} base(s) de conocimiento"

            if isinstance(file_filter, str) and file_filter.strip():
                needle = file_filter.strip().lower()
                matches = [
                    f for kb in kbs for f in kb["files"]
                    if needle in _file_name(f).lower() and f.get("id")
                ]
                if matches:
                    matches = matches[: max(1, self.valves.MAX_FILE_MATCHES)]
                    collection_ids = [f"file-{f['id']}" for f in matches]
                    scope = ", ".join(_file_name(f) for f in matches)
                    log.info(f"[query_knowledge] file_filter='{file_filter}' -> {collection_ids}")
                else:
                    available = "; ".join(
                        f"{kb['name']}: " + ", ".join(_file_name(f) for f in kb["files"])
                        for kb in kbs if kb["files"]
                    )
                    return (
                        f"No se encontro ningun archivo que coincida con '{file_filter}'. "
                        f"Archivos disponibles: {available or 'ninguno'}"
                    )

            queries = [q.strip() for q in (query, query_en) if isinstance(q, str) and q.strip()]
            await self._status(__event_emitter__, f"🔎 Buscando «{query}» en {scope}…")
            log.info(f"[query_knowledge] queries={queries} collections={collection_ids}")

            results = await query_collection(
                __request__,
                collection_names=collection_ids,
                queries=queries,
                embedding_function=embedding_function,
                k=self.valves.TOP_K,
            )

            if not results or "documents" not in results:
                await self._status(__event_emitter__, "Sin resultados", done=True)
                return "No se encontraron resultados relevantes en las bases de conocimiento."

            documents = results.get("documents", [[]])[0]
            metadatas = results.get("metadatas", [[]])[0]
            distances = results.get("distances", [[]])[0]

            chunks = []
            seen_texts = set()
            for idx, (doc, meta) in enumerate(zip(documents, metadatas)):
                doc = _clean_chunk(doc)
                page = meta.get("page_label", meta.get("page", ""))
                if len(doc) < self.valves.MIN_CHUNK_CHARS:
                    log.info(f"[query_knowledge] chunk descartado (muy corto, {len(doc)} chars): p. {page or '?'}")
                    continue
                if re.search(r"\.{10,}", doc):
                    log.info(f"[query_knowledge] chunk descartado (índice): p. {page or '?'}")
                    continue
                dedup_key = re.sub(r"\s+", " ", doc.lower())[:300]
                if dedup_key in seen_texts:
                    continue
                seen_texts.add(dedup_key)
                chunks.append({
                    "text": doc,
                    "source": meta.get("name", meta.get("source", "Desconocido")),
                    "page": page,
                    "score": distances[idx] if idx < len(distances) else None,
                })
                if len(chunks) >= self.valves.MAX_TOTAL_CHUNKS:
                    break

            if not chunks:
                await self._status(__event_emitter__, "Sin resultados", done=True)
                return "No se encontraron resultados relevantes en las bases de conocimiento."

            await self._emit_citations(__event_emitter__, chunks)
            n_sources = len({c["source"] for c in chunks})
            await self._status(
                __event_emitter__,
                f"✅ {len(chunks)} fragmentos en {n_sources} documento(s)",
                done=True,
            )
            log.info(f"[query_knowledge] queries={queries} -> {len(chunks)} chunks")

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
            await self._status(__event_emitter__, f"Error: {e}", done=True)
            return f"Error: {e}"

    # ── Tool 2: exploracion ────────────────────────────────────────────────────

    async def list_knowledge(
        self,
        __request__=None,
        __user__: dict = {},
    ) -> str:
        """
        Lista las bases de conocimiento disponibles y los archivos que contiene cada una.
        Usala para saber que documentacion existe o para elegir el valor de file_filter
        antes de llamar a query_knowledge.
        :return: Bases de conocimiento con sus archivos.
        """
        if __request__ is None:
            return "Error: contexto de request no disponible."
        try:
            kbs = await self._get_knowledge_bases(__request__, __user__)
            if not kbs:
                return "No hay bases de conocimiento disponibles para este usuario."
            lines = []
            for kb in kbs:
                lines.append(f"📚 {kb['name']} — {len(kb['files'])} archivo(s)")
                for f in kb["files"]:
                    name = _file_name(f) or f.get("id", "?")
                    lines.append(f"  - {name}")
            lines.append(
                "\nPara buscar solo en un archivo, pasa parte de su nombre en el "
                "parametro file_filter de query_knowledge."
            )
            return "\n".join(lines)
        except Exception as e:
            log.exception(f"[list_knowledge] Error: {e}")
            return f"Error: {e}"

    # ── Helpers ────────────────────────────────────────────────────────────────

    async def _api_get(self, __request__, __user__, path):
        base_url = str(__request__.base_url).rstrip("/")
        headers = {"Authorization": f"Bearer {__user__.get('token', '')}"}
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{base_url}{path}", headers=headers)
            resp.raise_for_status()
            return resp.json()

    async def _get_knowledge_bases(self, __request__, __user__):
        """Devuelve [{id, name, files}] de las KB configuradas en Valves o, si esta vacio,
        de todas las KB accesibles para el usuario."""
        configured = [s.strip() for s in self.valves.KNOWLEDGE_IDS.split(",") if s.strip()]
        kbs = []
        if configured:
            for kb_id in configured:
                kbs.append(await self._kb_detail(__request__, __user__, kb_id))
        else:
            try:
                listing = await self._api_get(__request__, __user__, "/api/v1/knowledge/")
            except Exception as e:
                log.warning(f"[query_knowledge] No se pudo listar las KB: {e}")
                return []
            for item in listing if isinstance(listing, list) else []:
                kb_id = item.get("id")
                if not kb_id:
                    continue
                files = item.get("files")
                if files is None:
                    kbs.append(await self._kb_detail(__request__, __user__, kb_id, item.get("name")))
                else:
                    kbs.append({"id": kb_id, "name": item.get("name", kb_id), "files": files})
        return [kb for kb in kbs if kb]

    async def _kb_detail(self, __request__, __user__, kb_id, name=None):
        """Obtiene nombre y archivos de una KB. Si la API falla, devuelve la KB sin archivos
        para que la busqueda sobre la coleccion completa siga funcionando."""
        for path in (f"/api/v1/knowledge/{kb_id}", f"/api/v1/knowledge/{kb_id}/files"):
            try:
                data = await self._api_get(__request__, __user__, path)
                if isinstance(data, dict) and isinstance(data.get("files"), list):
                    return {
                        "id": kb_id,
                        "name": data.get("name") or name or kb_id,
                        "files": data["files"],
                    }
            except Exception as e:
                log.warning(f"[query_knowledge] {path} fallo: {e}")
        return {"id": kb_id, "name": name or kb_id, "files": []}

    async def _status(self, emitter, description, done=False):
        if not emitter or not self.valves.EMIT_STATUS:
            return
        try:
            await emitter({"type": "status", "data": {"description": description, "done": done}})
        except Exception as e:
            log.warning(f"[query_knowledge] status emitter fallo: {e}")

    async def _emit_citations(self, emitter, chunks):
        if not emitter or not self.valves.EMIT_CITATIONS:
            return
        by_source = {}
        for c in chunks:
            by_source.setdefault(c["source"], []).append(c)
        for source, items in by_source.items():
            try:
                await emitter({
                    "type": "citation",
                    "data": {
                        "document": [c["text"] for c in items],
                        "metadata": [
                            {"source": source, "page": c["page"]} for c in items
                        ],
                        "source": {"name": source},
                    },
                })
            except Exception as e:
                log.warning(f"[query_knowledge] citation emitter fallo: {e}")
                return
