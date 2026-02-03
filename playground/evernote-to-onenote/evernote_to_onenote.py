#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convertidor de PDF de Evernote a OneNote (Versión Simplificada)
Extrae texto e imágenes de PDFs y los inserta en OneNote como contenido editable
"""

import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import fitz  # PyMuPDF
from PIL import Image
import io
import os
import tempfile
import win32com.client
from pathlib import Path


class EvernoteToOneNoteConverter:
    """Clase principal para convertir PDFs de Evernote a OneNote"""
    
    def __init__(self):
        self.pdf_path = None
        self.onenote = None
        
    def select_pdf(self):
        """Abre un diálogo para seleccionar el archivo PDF"""
        self.pdf_path = filedialog.askopenfilename(
            title="Seleccionar PDF de Evernote",
            filetypes=[("Archivos PDF", "*.pdf"), ("Todos los archivos", "*.*")]
        )
        return self.pdf_path
    
    def extract_pdf_content(self, pdf_path, progress_callback=None):
        """
        Extrae texto e imágenes del PDF
        
        Args:
            pdf_path: Ruta al archivo PDF
            progress_callback: Función opcional para reportar progreso
            
        Returns:
            Lista de diccionarios con contenido de cada página
        """
        pages_content = []
        
        try:
            doc = fitz.open(pdf_path)
            total_pages = len(doc)
            
            for page_num in range(total_pages):
                page = doc[page_num]
                
                # Extraer texto
                text = page.get_text()
                
                # Extraer imágenes
                images = []
                image_list = page.get_images(full=True)
                
                for img_index, img_info in enumerate(image_list):
                    xref = img_info[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    # Guardar imagen temporalmente
                    temp_dir = tempfile.gettempdir()
                    img_filename = f"evernote_img_p{page_num}_{img_index}.{image_ext}"
                    img_path = os.path.join(temp_dir, img_filename)
                    
                    with open(img_path, "wb") as img_file:
                        img_file.write(image_bytes)
                    
                    images.append(img_path)
                
                pages_content.append({
                    'page_num': page_num + 1,
                    'text': text,
                    'images': images
                })
                
                if progress_callback:
                    progress_callback(page_num + 1, total_pages)
            
            doc.close()
            return pages_content
            
        except Exception as e:
            raise Exception(f"Error al procesar el PDF: {str(e)}")
    
    def connect_to_onenote(self):
        """Establece conexión con OneNote mediante COM"""
        try:
            self.onenote = win32com.client.Dispatch("OneNote.Application")
            return True
        except Exception as e:
            raise Exception(f"Error al conectar con OneNote: {str(e)}\n"
                          "Asegúrate de que OneNote esté instalado.")
    
    def create_onenote_page(self, notebook_name, section_name, page_title, content):
        """
        Crea una nueva página en OneNote con el contenido extraído
        VERSIÓN SIMPLIFICADA: Crea en la sección actualmente abierta
        
        Args:
            notebook_name: Nombre del cuaderno (no usado en versión simplificada)
            section_name: Nombre de la sección (no usado en versión simplificada)
            page_title: Título de la página
            content: Lista de diccionarios con contenido de páginas
        """
        try:
            import xml.etree.ElementTree as ET
            
            # ENFOQUE SIMPLIFICADO: Crear página en la sección actual
            # Pasar cadena vacía crea la página en la sección que está abierta en OneNote
            new_page_id = self.onenote.CreateNewPage("")
            
            # Obtener el XML de la página recién creada
            current_xml = self.onenote.GetPageContent(new_page_id)
            current_root = ET.fromstring(current_xml)
            
            # Namespace de OneNote
            ns = {'one': 'http://schemas.microsoft.com/office/onenote/2013/onenote'}
            ET.register_namespace('one', ns['one'])
            
            # Obtener el ID real de la página
            page_id = current_root.get('ID')
            
            # Modificar el título
            title_elem = current_root.find('.//one:Title/one:OE/one:T', ns)
            if title_elem is not None:
                title_elem.text = page_title
            
            # Buscar PageSettings para insertar contenido antes
            page_settings = current_root.find('.//one:PageSettings', ns)
            
            # Agregar contenido del PDF
            for page_data in content:
                page_num = page_data['page_num']
                text = page_data['text']
                
                if text.strip():
                    # Crear outline para el contenido
                    outline = ET.Element(f'{{{ns["one"]}}}Outline')
                    
                    # Posición en la página
                    position = ET.SubElement(outline, f'{{{ns["one"]}}}Position')
                    position.set('x', '36.0')
                    position.set('y', str(100.0 + (page_num - 1) * 150.0))
                    
                    # Contenedor de elementos
                    oe_children = ET.SubElement(outline, f'{{{ns["one"]}}}OEChildren')
                    
                    # Agregar encabezado si hay múltiples páginas
                    if len(content) > 1:
                        oe_header = ET.SubElement(oe_children, f'{{{ns["one"]}}}OE')
                        t_header = ET.SubElement(oe_header, f'{{{ns["one"]}}}T')
                        t_header.text = f'--- Página {page_num} ---'
                    
                    # Agregar texto por párrafos (limitado a 30 párrafos por página)
                    paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
                    for para in paragraphs[:30]:
                        oe = ET.SubElement(oe_children, f'{{{ns["one"]}}}OE')
                        t = ET.SubElement(oe, f'{{{ns["one"]}}}T')
                        t.text = para
                    
                    # Insertar el outline en la página
                    if page_settings is not None:
                        current_root.insert(list(current_root).index(page_settings), outline)
                    else:
                        current_root.append(outline)
            
            # Convertir a XML string
            xml_str = ET.tostring(current_root, encoding='unicode', method='xml')
            final_xml = f'<?xml version="1.0"?>{xml_str}'
            
            # Actualizar la página
            self.onenote.UpdatePageContent(final_xml)
            
            # Navegar a la página creada
            self.onenote.NavigateTo(page_id)
            
            return True
            
        except Exception as e:
            raise Exception(f"Error al crear página en OneNote: {str(e)}")
    
    def convert(self, pdf_path, page_title=None, progress_callback=None):
        """
        Proceso completo de conversión
        
        Args:
            pdf_path: Ruta al archivo PDF
            page_title: Título para la página de OneNote (opcional)
            progress_callback: Función para reportar progreso
            
        Returns:
            True si la conversión fue exitosa
        """
        if not page_title:
            page_title = Path(pdf_path).stem
        
        # Extraer contenido del PDF
        if progress_callback:
            progress_callback("Extrayendo contenido del PDF...")
        
        content = self.extract_pdf_content(pdf_path, 
            lambda current, total: progress_callback(f"Procesando página {current}/{total}"))
        
        # Conectar con OneNote
        if progress_callback:
            progress_callback("Conectando con OneNote...")
        
        self.connect_to_onenote()
        
        # Crear página en OneNote
        if progress_callback:
            progress_callback("Creando página en OneNote...")
        
        self.create_onenote_page("", "", page_title, content)
        
        return True


class ConverterGUI:
    """Interfaz gráfica para el convertidor"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("Convertidor Evernote PDF → OneNote")
        self.root.geometry("600x450")
        self.root.resizable(False, False)
        
        self.converter = EvernoteToOneNoteConverter()
        self.selected_file = None
        
        self._create_widgets()
    
    def _create_widgets(self):
        """Crea los widgets de la interfaz"""
        
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Título
        title_label = ttk.Label(
            main_frame,
            text="Convertidor de PDF de Evernote a OneNote",
            font=("Segoe UI", 16, "bold")
        )
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Descripción
        desc_label = ttk.Label(
            main_frame,
            text="Convierte PDFs exportados desde Evernote a páginas editables en OneNote",
            wraplength=500,
            justify=tk.CENTER
        )
        desc_label.grid(row=1, column=0, columnspan=2, pady=(0, 20))
        
        # Nota importante
        note_label = ttk.Label(
            main_frame,
            text="⚠️ IMPORTANTE: Abre OneNote y navega a la sección donde quieres crear la página",
            wraplength=500,
            justify=tk.CENTER,
            foreground="red",
            font=("Segoe UI", 9, "bold")
        )
        note_label.grid(row=2, column=0, columnspan=2, pady=(0, 20))
        
        # Selección de archivo
        file_frame = ttk.LabelFrame(main_frame, text="Archivo PDF", padding="10")
        file_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 20))
        
        self.file_label = ttk.Label(file_frame, text="Ningún archivo seleccionado", foreground="gray")
        self.file_label.grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
        
        select_btn = ttk.Button(file_frame, text="Seleccionar PDF", command=self.select_file)
        select_btn.grid(row=0, column=1)
        
        # Campo de título
        title_frame = ttk.LabelFrame(main_frame, text="Título de la página en OneNote", padding="10")
        title_frame.grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 20))
        
        self.title_entry = ttk.Entry(title_frame, width=50)
        self.title_entry.grid(row=0, column=0, sticky=(tk.W, tk.E))
        
        # Botón de conversión
        self.convert_btn = ttk.Button(
            main_frame,
            text="Convertir a OneNote",
            command=self.convert,
            state=tk.DISABLED
        )
        self.convert_btn.grid(row=5, column=0, columnspan=2, pady=(0, 20))
        
        # Barra de progreso
        self.progress = ttk.Progressbar(main_frame, mode='indeterminate', length=500)
        self.progress.grid(row=6, column=0, columnspan=2, pady=(0, 10))
        
        # Etiqueta de estado
        self.status_label = ttk.Label(main_frame, text="", foreground="blue")
        self.status_label.grid(row=7, column=0, columnspan=2)
        
        # Configurar expansión de columnas
        main_frame.columnconfigure(0, weight=1)
        file_frame.columnconfigure(0, weight=1)
        title_frame.columnconfigure(0, weight=1)
    
    def select_file(self):
        """Maneja la selección de archivo PDF"""
        file_path = self.converter.select_pdf()
        
        if file_path:
            self.selected_file = file_path
            filename = os.path.basename(file_path)
            self.file_label.config(text=filename, foreground="black")
            self.convert_btn.config(state=tk.NORMAL)
            
            # Sugerir título basado en el nombre del archivo
            suggested_title = Path(file_path).stem
            self.title_entry.delete(0, tk.END)
            self.title_entry.insert(0, suggested_title)
    
    def update_status(self, message):
        """Actualiza el mensaje de estado"""
        self.status_label.config(text=message)
        self.root.update()
    
    def convert(self):
        """Ejecuta la conversión"""
        if not self.selected_file:
            messagebox.showerror("Error", "Por favor selecciona un archivo PDF primero")
            return
        
        page_title = self.title_entry.get().strip()
        if not page_title:
            page_title = Path(self.selected_file).stem
        
        # Verificar que OneNote esté abierto
        response = messagebox.askyesno(
            "Confirmar",
            "¿Has abierto OneNote y navegado a la sección donde quieres crear la página?\n\n"
            "La página se creará en la sección que esté actualmente visible en OneNote."
        )
        
        if not response:
            return
        
        # Deshabilitar botón durante la conversión
        self.convert_btn.config(state=tk.DISABLED)
        self.progress.start()
        
        try:
            # Ejecutar conversión
            self.converter.convert(
                self.selected_file,
                page_title,
                self.update_status
            )
            
            self.progress.stop()
            self.update_status("¡Conversión completada exitosamente!")
            
            messagebox.showinfo(
                "Éxito",
                f"El PDF se ha convertido exitosamente.\n"
                f"La página '{page_title}' se ha creado en OneNote."
            )
            
        except Exception as e:
            self.progress.stop()
            self.update_status("Error en la conversión")
            messagebox.showerror("Error", f"Error durante la conversión:\n{str(e)}")
        
        finally:
            self.convert_btn.config(state=tk.NORMAL)


def main():
    """Función principal"""
    root = tk.Tk()
    app = ConverterGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
