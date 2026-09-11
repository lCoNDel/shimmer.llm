# docker/backup/

## Propósito

Carpeta de respaldos manuales de volúmenes Docker de **producción**. No hay automatización ni rotación — cada backup se genera bajo demanda, normalmente justo antes de una actualización de versión que toque el volumen `open-webui`.

**Criterio (fijado 2026-06-12):** solo se respalda **prod**. En `open-webui-dev` puro no se hace backup porque no hay nada que no se pueda recrear. La única excepción es cuando el volumen `open-webui` es compartido entre prod y dev (como ha sido el caso) — entonces sí se respalda antes de tocar dev, porque las migraciones de esquema de dev afectan también a los datos de prod.

Los archivos `.tar.gz` de esta carpeta están excluidos de git (`.gitignore`) por peso — cada uno del volumen `open-webui` ronda 2-2.5 GB. Viven solo en local; no hay copia remota. Si se necesita conservar uno a largo plazo, sacarlo de aquí a un almacenamiento aparte (OneDrive, disco externo) y borrarlo de esta carpeta.

## Cómo se ha hecho hasta ahora

Comando usado en las dos actualizaciones registradas (mayo y junio 2026):

```powershell
docker run --rm -v open-webui:/data -v "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\docker\backup:/backup" alpine tar czf /backup/open-webui-backup-YYYYMMDD.tar.gz /data
```

Restauración (si una actualización sale mal):

```powershell
docker volume create open-webui
docker run --rm -v open-webui:/data -v "C:\Users\luisc\Documents\GitHub\shimmer.llm\proyectos\docker\backup:/backup" alpine sh -c "cd /data && tar xzf /backup/open-webui-backup-YYYYMMDD.tar.gz --strip-components=1"
```

Precedentes (ya borrados de disco, quedan documentados en los changelogs correspondientes):
- `open-webui-backup-20260509.tar.gz` (2,3 GB) — previo a actualización v0.9.2 → v0.9.4. Detalle: [log/2026/05/changelog_2026-05-09.md](../../log/2026/05/changelog_2026-05-09.md)
- `open-webui-backup-20260612.tar.gz` (2,1 GB) — previo a actualización dev v0.9.5 → v0.9.6 sobre volumen compartido con prod. Detalle: [log/2026/06/changelog_2026-06-12.md](../../log/2026/06/changelog_2026-06-12.md)

Existe también una skill genérica para respaldo Docker más completo (volúmenes + compose + config de contenedores + manifest): `agents/skills/docker-backup/SKILL.md`. Los backups reales hechos hasta ahora no han seguido ese procedimiento completo — solo el `docker run ... tar czf` del volumen, más simple y suficiente para el caso de uso (rollback de una migración de esquema).

## A futuro

- Antes de cada actualización de `open-webui` en prod (o en dev si el volumen sigue compartido), generar un backup nuevo aquí con el comando de arriba.
- Borrar el backup anterior una vez la actualización queda validada y estable — no acumular; esta carpeta llegó a pesar ~4.75 GB con solo dos archivos.
- Si `shimmercloud` (migración a Azure, objetivo noviembre 2026) cambia el modelo de persistencia, revisar si este procedimiento manual sigue teniendo sentido o si pasa a backup gestionado por Azure.
