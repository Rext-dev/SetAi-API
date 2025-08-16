<div align="center">

# SetAI API

**Control and Observability Layer** for the SetAI ecosystem, built with NestJS (v11) focused on quality, early observability, and containerized deployment.

</div>

## 🌐 General Description

The API acts as the **control and observability layer** of the SetAI ecosystem. Its main purpose is to store historical data, expose relevant information to the web interface, and coordinate with the bot through **Redis (Pub/Sub)**.

The bot and web components are treated as **black boxes** (or gray boxes when details are strictly needed), prioritizing the API as the integration and persistence core.

## 🚦 Current Status

Demo endpoint: `GET /api/hello` → "Hello World!".

**Infrastructure Ready**: Config + Environment validation (Zod), Pino logger, Global exception filter, Optional Redis integration, Prisma (initial schema), Multi-stage Docker, Basic CI, Husky + lint-staged + commitlint, Focused coverage testing.

## 📊 API Features

### 1. Historical Data Management
- Store information about **command execution status** from the bot
- Keep a **command history** with metadata (user, server, timestamp, result)  
- Serve as reference base for audits or configuration retries

### 2. Integration with Redis (Pub/Sub)
- **Subscribe** to Redis channels for:
  - `toggle-command`: Enable or disable specific bot features
  - `status-update`: Real-time number of running commands
- **Publish** events when the API requires the bot to perform an action (e.g., "pause commands")

### 3. Data Exposure Endpoints
- **GET /status** → General status of the bot (tasks in progress, paused commands, etc.)
- **GET /commands/history** → Historical list of executed commands  
- **GET /commands/{id}** → Details of a specific command
- **POST /commands/toggle** → Enable or disable a command (published to Redis)
- **GET /servers/{id}/summary** → Summary of a server (roles, categories, last configuration)

## 🗄️ Databases

### Redis
- **In-memory temporary data** for real-time communication
- **Pub/Sub** for dynamic command control  
- **Example use cases**: Number of active commands, feature toggles
- **Channels**: `toggle`, `reload`, `status.update`, `commands.state`, `heartbeat`

### MySQL  
- **Persistent and historical data** storage
- **Command execution table** with status tracking
- **User and server information** for context
- **Metrics logging** for analytics and observability

## 🔐 Environment Variables

See `.env.example`. Strict validation at startup: if anything critical is missing, the process terminates (fail-fast).

**Key variables**:
- `DATABASE_URL` must start with `mysql://`
- `REDIS_ENABLED=true` to enable Redis connections (otherwise `REDIS_HOST` is ignored)
- `LOG_LEVEL` (pino) defaults to `info`
- `METRICS_ENABLED` reserved for future `/metrics` exposure

## 🧪 Tests & Coverage

Coverage is limited to demonstrative files (`app.controller`, `app.service`) to keep tests green while the rest is infrastructure. Adjust `collectCoverageFrom` in `jest.config.ts` when adding business logic.

**Commands**:
```bash
npm test        # unit tests
npm test:cov    # coverage report
npm test:e2e    # end-to-end tests
```

## 🛠️ Main Scripts

```bash
npm run dev         # development with watch
npm run build       # compile to dist
npm run start       # run compiled version
npm run lint        # eslint check
npm run lint:fix    # eslint with auto-fix
npm run format      # prettier formatting
npm run prisma:generate # generate Prisma client
npm run prisma:migrate  # run database migrations
npm run prisma:deploy   # deploy migrations to production
```

## 📦 Docker

Multi-stage optimized build (Node 20-alpine + npm). Example local build:
```bash
docker build -t setai-api:local .
docker run --rm -p 3000:3000 --env-file .env setai-api:local
```

## 📨 Redis Integration

Decoupled and optional service. Enable only if:
```bash
REDIS_ENABLED=true
REDIS_HOST=localhost
```

Uses lazy subscription; if not enabled, it doesn't attempt to connect.

**Available Channels**:
- `toggle` - Feature toggle commands
- `reload` - Configuration reload requests  
- `status.update` - Real-time status updates from bot
- `commands.state` - Command execution state changes
- `heartbeat` - System health monitoring

## 🏗️ Architecture

### System Context (C4 Level 1)
The SetAI API serves as the central control plane in a distributed bot ecosystem:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Discord Bot   │◄──►│   SetAI API     │◄──►│  Web Dashboard  │
│                 │    │  (Control Plane)│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │    │
                              ▼    ▼
                    ┌─────────────┐ ┌─────────────┐
                    │    Redis    │ │    MySQL    │
                    │  (Pub/Sub)  │ │ (Persistent)│
                    └─────────────┘ └─────────────┘
```

### Container Diagram (C4 Level 2)
Shows the main application containers and their relationships:

- **SetAI API**: NestJS application providing REST endpoints and Redis coordination
- **Discord Bot**: External bot consuming API commands via Redis Pub/Sub  
- **Web Dashboard**: React/Vue frontend consuming API REST endpoints
- **Redis**: In-memory store for real-time communication and caching
- **MySQL**: Relational database for persistent historical data

### API Components (C4 Level 3)
Internal API architecture showing key modules:

- **REST Endpoints Module**: Controllers for external API access
- **Redis Pub/Sub Integration Module**: Event handling and message routing
- **MySQL Persistence Module**: Data access layer with Prisma ORM
- **Logging/Observability Module**: Centralized logging with Pino
- **Configuration Module**: Environment validation and app config

### Typical Execution Flow
1. **User** sends a command to the **Discord Bot**
2. **Bot** processes the command and publishes status to **Redis** 
3. **API** receives the Redis update and stores command history in **MySQL**
4. **Web Dashboard** queries the **API** to display real-time data to users
5. **API** can publish control messages to **Redis** to influence **Bot** behavior

## 🗺️ Roadmap

### Next Steps
- Auth JWT + roles / scopes
- Automated Swagger / OpenAPI documentation
- Complete Redis pub/sub implementation (event routing)
- Prometheus metrics (`/metrics` endpoint gated by flag)
- OpenTelemetry tracing integration  
- Command persistence / use case implementation
- Request ID + log correlation
- Security hardening (headers, CSP, rate limiting fine-tuning)
- Automated dependency updates (Dependabot / Renovate)

### Initial API Endpoints (Planned)
- `GET /api/status` - System and bot status information
- `GET /api/commands/history` - Paginated command execution history
- `GET /api/commands/:id` - Detailed information about specific command
- `POST /api/commands/toggle` - Enable/disable bot commands 
- `GET /api/servers/:id/summary` - Server configuration and statistics

## 🤝 Contributing

See `CONTRIBUTING.md`. Commits: Conventional Commits. Hooks manage automatic formatting/linting.

## 📄 License

MIT
