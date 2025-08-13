<div align="center">

# SetAI API

Infraestructura base (control plane) construida con NestJS (v11) enfocada en calidad, observabilidad temprana y despliegue contenedorizado.

</div>

## 🚦 Estado actual

Endpoint único de demo: `GET /api/hello` → "Hello World!".

Infra lista: Config + Validación env (Zod), Logger Pino, Filtro de excepciones global, Redis opcional, Prisma (esquema inicial), Docker multi-stage, CI básico, Husky + lint-staged + commitlint, pruebas con cobertura focalizada.

## 🔐 Variables de entorno

Ver `.env.example`. Validación estricta en arranque: si falta algo crítico el proceso termina (fail-fast).

Claves destacadas:
- `DATABASE_URL` debe iniciar con `mysql://`
- `REDIS_ENABLED=true` para activar conexiones Redis (sino se ignora `REDIS_HOST`)
- `LOG_LEVEL` (pino) por defecto `info`
- `METRICS_ENABLED` reservado para futura exposición `/metrics`

## 🧪 Pruebas & Cobertura

Se limita cobertura a archivos demostrativos (`app.controller`, `app.service`) para mantener verde mientras el resto es infraestructura. Ajustar `collectCoverageFrom` en `jest.config.ts` cuando se añada lógica.

Comandos:
```
pnpm test        # unit
pnpm test:cov    # cobertura
```

## 🛠️ Scripts principales

```
pnpm dev         # desarrollo watch
pnpm build       # compilar a dist
pnpm start       # ejecutar compilado
pnpm lint        # eslint
pnpm lint:fix    # eslint --fix
pnpm format      # prettier
pnpm prisma:generate | migrate | deploy
```

## 📦 Docker

Multi-stage optimizado (Node 20-alpine + pnpm). Ejemplo build local:
```
docker build -t setai-api:local .
docker run --rm -p 3000:3000 --env-file .env setai-api:local
```


## 📨 Redis

Servicio desacoplado y opcional. Activar sólo si:
```
REDIS_ENABLED=true
REDIS_HOST=localhost
```
Usa suscripción lazy; si no está habilitado no intenta conectar.

## 🗺️ Roadmap (próximo)

- Auth JWT + roles / scopes
- Swagger / OpenAPI automatizado
- Redis pub/sub completo (event routing)
- Métricas Prometheus (`/metrics` gated by flag)
- Tracing OpenTelemetry
- Persistencia de comandos / casos de uso
- Request ID + correlación logs
- Endurecimiento seguridad (headers, CSP, rate fine tuning)
- Dependabot / Renovate

## 🤝 Contribución

Ver `CONTRIBUTING.md`. Commits: Conventional Commits. Hooks gestionan formato/lint automático.

## 📄 Licencia

MIT
