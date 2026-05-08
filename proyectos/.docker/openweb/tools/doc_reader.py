"""
title: File Reader
author: shimmer.llm
description: Lee archivos adjuntos al chat (Excel, Word, PDF, texto) y devuelve su contenido estructurado para que el modelo pueda procesarlos.
version: 2.0.0
requirements: openpyxl, python-docx, pypdf
"""

import json
import os
from typing import Optional


class Tools:
    def __init__(self):
        self.upload_dir = os.environ.get("UPLOAD_DIR", "/app/backend/data/uploads")

    def read_file(
        self,
        sheet_name: Optional[str] = None,
        max_rows: int = 1000,
        __files__: list = [],
        __user__: dict = {},
    ) -> str:
        """
        Lee el archivo adjunto al chat y devuelve su contenido estructurado.
        Soporta: .xlsx, .xls, .xlsm, .docx, .pdf, .txt, .csv, .md

        :param sheet_name: Solo para Excel — nombre de la hoja a leer. Si no se especifica, lee la primera.
        :param max_rows: Solo para Excel/CSV — número máximo de filas a devolver (por defecto 1000).
        :return: JSON con el contenido del archivo.
        """
        EXCEL_EXTS = (".xlsx", ".xls", ".xlsm")
        SUPPORTED_EXTS = EXCEL_EXTS + (".docx", ".pdf", ".txt", ".csv", ".md")

        # Resolver ruta del archivo adjunto
        file_path = None
        file_name = None
        upload_files = os.listdir(self.upload_dir) if os.path.isdir(self.upload_dir) else []

        for f in __files__:
            if not isinstance(f, dict):
                continue

            name = f.get("name", f.get("filename", ""))
            file_id = f.get("id", "")

            if not name.lower().endswith(SUPPORTED_EXTS):
                continue

            if file_id:
                for fname in upload_files:
                    if fname.startswith(file_id):
                        file_path = os.path.join(self.upload_dir, fname)
                        file_name = name
                        break

            if not file_path:
                candidate = os.path.join(self.upload_dir, name)
                if os.path.exists(candidate):
                    file_path = candidate
                    file_name = name

            if file_path:
                break

        if not file_path:
            return json.dumps({
                "error": "No se encontró ningún archivo compatible adjunto. Adjunta un archivo al chat y vuelve a intentarlo.",
                "formatos_soportados": list(SUPPORTED_EXTS),
                "files_recibidos": [f.get("name", "") for f in __files__ if isinstance(f, dict)]
            })

        ext = os.path.splitext(file_name)[1].lower()

        if ext in EXCEL_EXTS:
            return self._read_excel(file_path, file_name, sheet_name, max_rows)
        elif ext == ".docx":
            return self._read_docx(file_path, file_name)
        elif ext == ".pdf":
            return self._read_pdf(file_path, file_name)
        elif ext in (".txt", ".md"):
            return self._read_text(file_path, file_name)
        elif ext == ".csv":
            return self._read_csv(file_path, file_name, max_rows)
        else:
            return json.dumps({"error": f"Formato no soportado: {ext}"})

    # ── Excel ──────────────────────────────────────────────────────────────────

    def _read_excel(self, file_path, file_name, sheet_name, max_rows):
        try:
            import openpyxl
        except ImportError:
            return json.dumps({"error": "openpyxl no está instalado en el servidor."})

        try:
            wb = openpyxl.load_workbook(file_path, read_only=True, data_only=True)
            available_sheets = wb.sheetnames

            if sheet_name and sheet_name in available_sheets:
                ws = wb[sheet_name]
                active_sheet = sheet_name
            else:
                ws = wb.active
                active_sheet = ws.title

            headers = []
            rows = []
            for i, row in enumerate(ws.iter_rows(values_only=True)):
                if i == 0:
                    headers = [
                        str(c).strip() if c is not None else f"Col{j + 1}"
                        for j, c in enumerate(row)
                    ]
                else:
                    if len(rows) >= max_rows:
                        break
                    if all(v is None for v in row):
                        continue
                    row_data = {
                        headers[j]: (str(v).strip() if v is not None else "")
                        for j, v in enumerate(row)
                        if j < len(headers)
                    }
                    rows.append(row_data)

            wb.close()

            return json.dumps({
                "file": file_name,
                "type": "excel",
                "sheet": active_sheet,
                "available_sheets": available_sheets,
                "columns": headers,
                "row_count": len(rows),
                "rows": rows,
            }, ensure_ascii=False)

        except Exception as e:
            return json.dumps({"error": f"Error al leer el Excel: {str(e)}"})

    # ── Word ───────────────────────────────────────────────────────────────────

    def _read_docx(self, file_path, file_name):
        try:
            from docx import Document
        except ImportError:
            return json.dumps({"error": "python-docx no está instalado en el servidor."})

        try:
            doc = Document(file_path)
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            tables = []
            for table in doc.tables:
                table_data = []
                for row in table.rows:
                    table_data.append([cell.text.strip() for cell in row.cells])
                tables.append(table_data)

            return json.dumps({
                "file": file_name,
                "type": "word",
                "paragraph_count": len(paragraphs),
                "paragraphs": paragraphs,
                "table_count": len(tables),
                "tables": tables,
            }, ensure_ascii=False)

        except Exception as e:
            return json.dumps({"error": f"Error al leer el Word: {str(e)}"})

    # ── PDF ────────────────────────────────────────────────────────────────────

    def _read_pdf(self, file_path, file_name):
        try:
            from pypdf import PdfReader
        except ImportError:
            return json.dumps({"error": "pypdf no está instalado en el servidor."})

        try:
            reader = PdfReader(file_path)
            pages = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages.append({"page": i + 1, "text": text.strip()})

            full_text = "\n\n".join(p["text"] for p in pages if p["text"])

            return json.dumps({
                "file": file_name,
                "type": "pdf",
                "page_count": len(pages),
                "pages": pages,
                "full_text": full_text,
            }, ensure_ascii=False)

        except Exception as e:
            return json.dumps({"error": f"Error al leer el PDF: {str(e)}"})

    # ── Texto plano / Markdown ─────────────────────────────────────────────────

    def _read_text(self, file_path, file_name):
        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as fh:
                content = fh.read()

            lines = content.splitlines()
            return json.dumps({
                "file": file_name,
                "type": "text",
                "line_count": len(lines),
                "content": content,
            }, ensure_ascii=False)

        except Exception as e:
            return json.dumps({"error": f"Error al leer el archivo de texto: {str(e)}"})

    # ── CSV ────────────────────────────────────────────────────────────────────

    def _read_csv(self, file_path, file_name, max_rows):
        import csv

        try:
            with open(file_path, "r", encoding="utf-8", errors="replace", newline="") as fh:
                reader = csv.DictReader(fh)
                headers = reader.fieldnames or []
                rows = []
                for row in reader:
                    if len(rows) >= max_rows:
                        break
                    rows.append(dict(row))

            return json.dumps({
                "file": file_name,
                "type": "csv",
                "columns": list(headers),
                "row_count": len(rows),
                "rows": rows,
            }, ensure_ascii=False)

        except Exception as e:
            return json.dumps({"error": f"Error al leer el CSV: {str(e)}"})
