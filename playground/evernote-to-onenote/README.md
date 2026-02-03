# Convertidor de PDF de Evernote a OneNote

Aplicación de escritorio para Windows que convierte archivos PDF exportados desde Evernote a páginas editables en OneNote, preservando el texto y las imágenes.

## 📋 Requisitos del Sistema

- **Sistema Operativo**: Windows 11 (o Windows 10)
- **Microsoft OneNote**: Debe estar instalado en tu sistema
- **Python**: 3.8 o superior

## 🚀 Instalación

### 1. Instalar Python

Si no tienes Python instalado, descárgalo desde [python.org](https://www.python.org/downloads/) y asegúrate de marcar la opción "Add Python to PATH" durante la instalación.

### 2. Instalar Dependencias

Abre PowerShell o el Símbolo del sistema en la carpeta del proyecto y ejecuta:

```powershell
pip install -r requirements.txt
```

Esto instalará las siguientes bibliotecas:
- **PyMuPDF**: Para leer y extraer contenido de PDFs
- **Pillow**: Para procesamiento de imágenes
- **pywin32**: Para comunicarse con OneNote mediante COM

## 📖 Uso

### Ejecutar la Aplicación

1. Abre PowerShell o el Símbolo del sistema en la carpeta del proyecto
2. Ejecuta el siguiente comando:

```powershell
python evernote_to_onenote.py
```

### Convertir un PDF

1. **Seleccionar PDF**: Haz clic en "Seleccionar PDF" y elige el archivo PDF exportado desde Evernote
2. **Título de la Página**: El título se sugiere automáticamente basado en el nombre del archivo, pero puedes modificarlo
3. **Convertir**: Haz clic en "Convertir a OneNote"
4. **Resultado**: La aplicación creará una nueva página en OneNote con el contenido del PDF

### Dónde Encontrar tu Contenido en OneNote

El contenido convertido se creará en:
- **Cuaderno**: "Importado desde Evernote"
- **Sección**: "PDFs"
- **Página**: El título que especificaste

## ✨ Características

- ✅ **Texto Editable**: El texto del PDF se extrae y se inserta como texto editable en OneNote
- ✅ **Imágenes Preservadas**: Las imágenes embebidas en el PDF se insertan en OneNote
- ✅ **Interfaz Gráfica**: Fácil de usar con interfaz visual
- ✅ **Progreso Visual**: Barra de progreso y mensajes de estado durante la conversión
- ✅ **Múltiples Páginas**: Soporta PDFs con múltiples páginas

## ⚠️ Limitaciones

- **Formato Complejo**: Tablas, columnas múltiples y formatos complejos pueden no transferirse perfectamente
- **Estilos**: Los estilos de fuente y colores pueden no preservarse exactamente
- **OneNote Requerido**: OneNote debe estar instalado y funcionando en tu sistema
- **Solo Windows**: La aplicación usa la API COM de Windows, por lo que solo funciona en Windows

## 🔧 Solución de Problemas

### Error: "No se puede conectar con OneNote"

**Solución**: 
- Asegúrate de que OneNote esté instalado en tu sistema
- Abre OneNote al menos una vez antes de usar la aplicación
- Verifica que OneNote no esté bloqueado por políticas de seguridad

### Error: "Error al procesar el PDF"

**Solución**:
- Verifica que el archivo PDF no esté corrupto
- Asegúrate de que el PDF no esté protegido con contraseña
- Intenta abrir el PDF en un lector de PDF para confirmar que es válido

### La conversión es lenta

**Causa**: PDFs grandes con muchas imágenes pueden tardar varios minutos

**Solución**: Ten paciencia y espera a que la barra de progreso complete

### El texto no se ve bien en OneNote

**Causa**: Algunos PDFs tienen formatos complejos que no se traducen perfectamente

**Solución**: Puedes editar manualmente el texto en OneNote después de la conversión

## 📝 Notas Adicionales

### Exportar desde Evernote

Para exportar una nota de Evernote como PDF:

1. Abre la nota en Evernote
2. Haz clic en el menú de tres puntos (⋯)
3. Selecciona "Exportar nota"
4. Elige "PDF" como formato
5. Guarda el archivo

### Mejores Prácticas

- **Nombres Descriptivos**: Usa nombres de archivo descriptivos para tus PDFs, ya que se usarán como títulos sugeridos
- **Organización**: Considera crear secciones específicas en OneNote antes de importar para mejor organización
- **Revisión**: Siempre revisa el contenido importado en OneNote para verificar que todo se haya transferido correctamente

## 🆘 Soporte

Si encuentras problemas o tienes preguntas:

1. Verifica que todas las dependencias estén instaladas correctamente
2. Asegúrate de que OneNote esté funcionando correctamente
3. Revisa los mensajes de error para obtener más detalles

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y comercial.
