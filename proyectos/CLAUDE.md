# Shimmer LLM — proyectos/

> El contexto completo del proyecto está en [../CLAUDE.md](../CLAUDE.md).
> Este archivo añade instrucciones específicas para el working directory `proyectos/`.

## Working Directory

```
proyectos/
├── .backlog/   # Ideas y proyectos futuros (ACTIVO — no ignorar)
├── .bots/      # Bots de mensajería (Telegram, WhatsApp...)
├── .docker/    # Docker Compose, Filebrowser inyectable, scripts de backup
├── .docs/      # Documentación de servicios (Open WebUI, etc.)
├── .agents/       # Skills del sistema de agentes
└── .webapps/   # Proyectos web paralelos
```

## Reglas por zona

### `.webapps/dev/`
Zona de trabajo activo. Los cambios aquí son libres y no requieren autorización especial.
Los cambios de dev se sincronizan manualmente a prod una vez validados.

### `.webapps/prod/`
Zona de producción. Contiene la versión publicada o lista para publicar.

**ADVERTENCIA: Doble autorización requerida antes de cualquier cambio:**
1. Describir exactamente qué archivo se va a modificar y qué cambio se hará.
2. Esperar confirmación explícita del usuario.
3. No proceder aunque el cambio sea idéntico a uno ya aplicado en `dev/`.

Una autorización previa en `dev/` **no implica autorización en `prod/`**.

### `.webapps/antiguos/`
Archivo de versiones anteriores. No se modifican.

---

## Convenciones

- **Idioma**: Responder siempre en español salvo que el código o contexto técnico lo requiera en inglés.
- **Skills**: Al crear o modificar una skill, respetar el formato definido en `.agents/god/SKILL.md`.
- **Docker**: El stack de producción parte de `.docker/compose/prod.yml`. No modificar sin confirmar.
- **Backlog**: `.backlog/` es el backlog activo — tenerlo en cuenta al planificar trabajo.
- **Puertos**: Respetar el esquema definido en [.docker/puertos.md](.docker/puertos.md).
