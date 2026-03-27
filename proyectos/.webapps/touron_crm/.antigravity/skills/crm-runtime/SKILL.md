---
name: crm-runtime
description: Gestiona el ciclo de vida (inicio y parada) del servicio CRM de Touron. Utiliza esta habilidad para arrancar el entorno de desarrollo en el puerto 3001 o para detener procesos que estén bloqueando dicho puerto.
---

# Runtime CRM

Esta habilidad proporciona una interfaz estandarizada para manejar el servicio CRM local.

## Comandos y Scripts

*   **Arranque**: `npm run dev` (ejecutado desde la raíz del proyecto `touron_crm`).
*   **Parada**: Script PowerShell para liberar el puerto 3001.

## Flujo de Trabajo

### 1. Iniciar el Servicio
Cuando el usuario pida iniciar el CRM:
1. Asegúrate de estar en `C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\touron_crm`.
2. Ejecuta `npm run dev`.
3. Monitoriza la salida hasta ver `✓ Ready` o `▲ Next.js`.

### 2. Detener el Servicio
Cuando el usuario pida detener el CRM o si el puerto 3001 está ocupado:
1. Ejecuta el script de parada:
   ```powershell
   C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\touron_crm\.antigravity\skills\crm-runtime\scripts\stop.ps1
   ```

## Notas Técnicas
*   El CRM utiliza Next.js y escucha por defecto en el puerto 3001.
*   La base de datos es SQLite (`touron.db`), por lo que no requiere servicios adicionales de BD externos para el arranque básico.
