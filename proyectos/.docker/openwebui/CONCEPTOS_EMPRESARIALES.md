# Conceptos de Arquitectura Empresarial vs. Home Lab

Este documento expande los conceptos mencionados en la evaluación de la plataforma, explicando el "por qué" de las prácticas empresariales frente a tu solución actual.

## 1. "Separar Responsabilidades" (The Single Responsibility Principle)

En tu setup actual, tienes una arquitectura **Monolítica** a nivel de contenedor:
*   **Contenedor `open-webui`**: 
    1.  Sirve la Interfaz Web de Chat.
    2.  Gestiona la Base de Datos.
    3.  **Y ADEMÁS** gestiona tus archivos (FileBrowser).

**¿Por qué las empresas lo separan?**
Imagina que FileBrowser tiene un bug que consume el 100% de la CPU o bloquea el disco al intentar leer un archivo corrupto.
*   **En tu caso:** Se cae TODO. Te quedas sin Chat y sin IA, porque comparten el mismo "corazón" (el mismo PID namespace y recursos del contenedor).
*   **En empresa:** Si FileBrowser estuviera en su propio contenedor (Sidecar), solo se caería el gestor de archivos. El Chat seguiría funcionando para los usuarios críticos.

> **Resumen:** Separar reduce el "Radio de Explosión" (Blast Radius). Si algo falla, que no se lleve todo por delante.

## 2. Autenticación "Centralizada" vs. "Sincronizada"

Mencionas que la autenticación está centralizada. Probablemente te refieres a que usas el mismo usuario/pass, pero técnicamente:
*   **OpenWebUI** tiene su tabla de usuarios en su DB interna.
*   **FileBrowser** tiene su propia DB (`filebrowser.db`) con sus propios usuarios.

Si cambias tu contraseña en OpenWebUI, **no** cambia en FileBrowser automáticamente, a menos que tengas un script o mecanismo oculto que lo haga.
*   **Empresa (SSO):** Usan un tercer servidor (como Keycloak o Microsoft Entra ID). OpenWebUI y FileBrowser no guardan passwords, solo preguntan a ese servidor "¿Es este Luis?". Si Luis se va de la empresa, se le corta el acceso en un solo sitio y pierde acceso a todo instantáneamente.

## 3. Kubernetes/Docker Compose vs. Scripts PowerShell (`.ps1`)

Esta es la diferencia entre **"Mascotas" (Pets)** y **"Ganado" (Cattle)**.

### Tu enfoque (`update.ps1`) = Mascotas 🐶
Tratas a tu servidor con cariño.
1.  Bajas la imagen.
2.  Levantas el contenedor.
3.  Ejecutas un script manual para "curarlo" (inyectar FileBrowser).
4.  Si el servidor se reinicia un domingo a las 3AM, FileBrowser no funcionará hasta que tú (el humano) vuelvas y corras el script.

### Enfoque Empresarial (Kubernetes) = Ganado 🐄
Define el **"Estado Deseado"** en un archivo de texto (YAML), no los pasos para conseguirlo.

Le dices a Kubernetes: *"Quiero que SIEMPRE haya un OpenWebUI funcionando y que SIEMPRE tenga FileBrowser al lado"*.
Kubernetes actúa como un robot autónomo:
1.  Si OpenWebUI se muere, crea otro nuevo.
2.  Si detecta que falta FileBrowser, lo lanza automáticamente.
3.  No necesita que Luis ejecute un script. Se "auto-repara".

> **Resumen:** 
> *   **Scripts:** Dicen "Haz esto, luego esto, luego esto". Son imperativos. Frágiles si algo falla en medio.
> *   **Orquestadores (K8s/Compose):** Dicen "Quiero que el resultado final sea X". Son declarativos. Robustos.
