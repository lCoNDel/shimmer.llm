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

## Convenciones

- **Idioma**: Responder siempre en español salvo que el código o contexto técnico lo requiera en inglés.
- **Skills**: Al crear o modificar una skill, respetar el formato definido en `.agents/god/SKILL.md`.
- **Docker**: El stack de producción parte de `.docker/compose/prod.yml`. No modificar sin confirmar.
- **Backlog**: `.backlog/` es el backlog activo — tenerlo en cuenta al planificar trabajo.
- **Puertos**: Respetar el esquema definido en [.docker/puertos.md](.docker/puertos.md).
