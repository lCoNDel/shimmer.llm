# OpenWebUI v0.8.0 - Novedades Destacadas

Esta versión introduce cambios significativos y nuevas características experimentales.

> [!WARNING]
> **Migración de Base de Datos Necesaria**: Esta versión incluye cambios en el esquema de la base de datos.
> **Migración de Tabla de Mensajes**: Puede tomar tiempo en iniciarse la primera vez si tienes un historial de chat muy extenso.

## 🌟 Características Principales

### 📊 Análisis y Gestión
- **Panel de Analíticas**: Nuevo dashboard para administradores con estadísticas de uso de modelos, consumo de tokens y actividad de usuarios ([#21106]).
- **Gestión de Archivos**: Ahora puedes ver, buscar y borrar todos tus archivos subidos desde la Configuración ([#21047]).

### 🤖 Capacidades de IA Experimentales
- **Skills (Habilidades)**: Soporte experimental para crear habilidades reutilizables que puedes invocar en el chat con el comando `$` ([#21312]).
- **Protocolo Open Responses**: Soporte nativo para modelos de razonamiento extendido ("thinking models") y mejor manejo de llamadas a herramientas.

### 💬 Experiencia de Chat
- **Cola de Mensajes**: Ya no necesitas esperar a que termine de generarse una respuesta. Puedes poner mensajes en cola y seguir escribiendo.
- **Búsqueda Web Asíncrona**: Las búsquedas ahora ocurren en segundo plano sin bloquear la interfaz.
- **Indicador de Tareas Activas**: Verás en la barra lateral qué chats tienen tareas ejecutándose.

### 🛠️ Herramientas y Control
- **Ejecución de Código Nativa**: Los modelos pueden ejecutar código Python para cálculos y visualizaciones sin depender del modo "Default" ([#20592]).
- **Editor de Imágenes Concurrente**: Edición de múltiples imágenes mucho más rápida.
- **Control de Versiones de Prompts**: Historial completo de cambios en tus prompts, con capacidad de revertir a versiones anteriores.

## ⚙️ Mejoras de Rendimiento
- **Carga más rápida**: Optimizaciones masivas en autenticación, carga de listas de modelos y actualizaciones de perfil.
- **Debouncing en Búsqueda**: La interfaz responde mejor al buscar usuarios, chats o archivos.

## 📝 Notas Técnicas Adicionales
- **Nuevas Variables de Entorno**: Se han añadido opciones para configurar SSL personalizado en herramientas MCP y headers personalizados.
- **Soporte PDF**: Nuevos modos de carga "page" vs "single" para documentos PDF.
