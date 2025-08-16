# SetAI API - Architecture Documentation

This document provides detailed architectural documentation for the SetAI API, following the C4 model for software architecture.

## Table of Contents
- [System Context (C4 Level 1)](#system-context-c4-level-1)
- [Container Diagram (C4 Level 2)](#container-diagram-c4-level-2)  
- [Component Diagram (C4 Level 3)](#component-diagram-c4-level-3)
- [Execution Flows](#execution-flows)
- [Data Models](#data-models)
- [Integration Patterns](#integration-patterns)

## System Context (C4 Level 1)

The SetAI system is a Discord bot management platform consisting of multiple interconnected services.

```mermaid
graph TB
    User[Discord Users]
    Admin[System Administrators]
    
    User --> Bot[SetAI Discord Bot]
    Admin --> Web[Web Dashboard]
    
    Bot <--> API[SetAI API<br/>Control & Observability Layer]
    Web <--> API
    
    API --> Redis[(Redis<br/>Pub/Sub & Cache)]
    API --> MySQL[(MySQL<br/>Persistent Storage)]
    
    subgraph "SetAI Ecosystem"
        Bot
        API
        Web
        Redis
        MySQL
    end
    
    classDef primary fill:#e1f5fe
    classDef storage fill:#f3e5f5
    classDef external fill:#e8f5e8
    
    class API primary
    class Redis,MySQL storage  
    class User,Admin external
```

### Key Actors
- **Discord Users**: End users interacting with the bot through Discord commands
- **System Administrators**: Users managing the system through the web dashboard

### System Responsibilities
- **SetAI API**: Central control plane for coordination, data persistence, and observability
- **SetAI Discord Bot**: Handles Discord interactions and executes user commands
- **Web Dashboard**: Administrative interface for system monitoring and configuration

## Container Diagram (C4 Level 2)

Shows the high-level technology choices and communication patterns between containers.

```mermaid
graph TB
    subgraph "External Systems"
        Discord[Discord API]
        Users[Discord Users]
        Admins[System Administrators]
    end
    
    subgraph "SetAI Platform"
        subgraph "Application Layer"
            Bot[Discord Bot<br/>Node.js / Discord.js]
            API[SetAI API<br/>NestJS / TypeScript]
            Web[Web Dashboard<br/>React / Vue.js]
        end
        
        subgraph "Data Layer"
            Redis[(Redis<br/>In-Memory Cache<br/>Pub/Sub Messaging)]
            MySQL[(MySQL<br/>Persistent Storage<br/>Historical Data)]
        end
    end
    
    Users -.-> Discord
    Discord <--> Bot
    Admins <--> Web
    
    Bot <--> |Redis Pub/Sub<br/>Real-time Events| Redis
    API <--> |Subscribe/Publish<br/>Event Coordination| Redis
    
    Bot -.-> |Command Results<br/>Status Updates| API
    Web <--> |REST API<br/>JSON over HTTPS| API
    API <--> |Prisma ORM<br/>SQL Queries| MySQL
    
    classDef app fill:#e1f5fe
    classDef data fill:#f3e5f5
    classDef external fill:#e8f5e8
    
    class Bot,API,Web app
    class Redis,MySQL data
    class Discord,Users,Admins external
```

### Container Details

#### SetAI API (NestJS)
- **Technology**: NestJS, TypeScript, Prisma ORM
- **Purpose**: Central control plane and data coordination
- **Responsibilities**:
  - Expose REST API endpoints for web dashboard
  - Coordinate with bot via Redis Pub/Sub
  - Persist historical data in MySQL
  - Provide system observability and monitoring

#### Discord Bot (Node.js)
- **Technology**: Node.js, Discord.js
- **Purpose**: Handle Discord user interactions
- **Responsibilities**:
  - Process Discord commands and events
  - Execute bot functionalities
  - Publish status updates to Redis
  - Subscribe to control commands from API

#### Web Dashboard
- **Technology**: Modern JavaScript framework (React/Vue)
- **Purpose**: Administrative interface
- **Responsibilities**:
  - Display system status and metrics
  - Provide command history visualization
  - Enable/disable bot features
  - Server configuration management

#### Redis
- **Technology**: Redis 6+
- **Purpose**: Real-time communication and caching
- **Responsibilities**:
  - Pub/Sub messaging between API and Bot
  - Cache frequently accessed data
  - Store temporary session data

#### MySQL
- **Technology**: MySQL 8+
- **Purpose**: Persistent data storage
- **Responsibilities**:
  - Store command execution history
  - Maintain user and server configurations
  - Analytics and audit trail data

## Component Diagram (C4 Level 3)

Focuses on the internal architecture of the SetAI API container.

```mermaid
graph TB
    subgraph "SetAI API (NestJS Application)"
        subgraph "Presentation Layer"
            RestController[REST Controllers<br/>Express Routes]
            WebhookController[Webhook Controllers<br/>External Events]
        end
        
        subgraph "Business Logic Layer"  
            CommandService[Command Service<br/>Business Logic]
            StatusService[Status Service<br/>System Monitoring]
            ServerService[Server Service<br/>Configuration Management]
        end
        
        subgraph "Integration Layer"
            RedisModule[Redis Module<br/>Pub/Sub Integration]
            EventHandler[Event Handler<br/>Message Routing]
        end
        
        subgraph "Data Access Layer"
            PrismaModule[Prisma Module<br/>ORM & Database Access]
            CacheService[Cache Service<br/>Data Caching Layer]
        end
        
        subgraph "Infrastructure Layer"
            ConfigModule[Config Module<br/>Environment Validation]
            LoggingModule[Logging Module<br/>Pino Logger]
            ValidationModule[Validation Module<br/>Request/Response Validation]
        end
    end
    
    subgraph "External Dependencies"
        WebClient[Web Dashboard]
        RedisDB[(Redis)]
        MySQL[(MySQL)]
    end
    
    WebClient --> RestController
    RestController --> CommandService
    RestController --> StatusService  
    RestController --> ServerService
    
    CommandService --> RedisModule
    StatusService --> RedisModule
    ServerService --> PrismaModule
    
    RedisModule <--> RedisDB
    RedisModule --> EventHandler
    EventHandler --> CommandService
    
    PrismaModule <--> MySQL
    CommandService --> PrismaModule
    StatusService --> CacheService
    CacheService --> RedisDB
    
    classDef presentation fill:#e3f2fd
    classDef business fill:#e8f5e8
    classDef integration fill:#fff3e0
    classDef data fill:#fce4ec
    classDef infrastructure fill:#f1f8e9
    classDef external fill:#f5f5f5
    
    class RestController,WebhookController presentation
    class CommandService,StatusService,ServerService business
    class RedisModule,EventHandler integration
    class PrismaModule,CacheService data
    class ConfigModule,LoggingModule,ValidationModule infrastructure
    class WebClient,RedisDB,MySQL external
```

## Execution Flows

### 1. Command Execution Flow

```mermaid
sequenceDiagram
    participant User as Discord User
    participant Bot as Discord Bot  
    participant Redis as Redis
    participant API as SetAI API
    participant DB as MySQL
    participant Web as Web Dashboard
    
    User->>Bot: /command execute
    Bot->>Bot: Process command
    Bot->>Redis: Publish command.start
    Redis->>API: Event: command.start
    API->>DB: Store command record
    
    Bot->>Bot: Execute business logic
    Bot->>Redis: Publish command.progress
    Redis->>API: Event: command.progress  
    API->>DB: Update command status
    
    Bot->>Redis: Publish command.complete
    Redis->>API: Event: command.complete
    API->>DB: Update final status
    API->>Redis: Publish status.update
    
    Web->>API: GET /commands/history
    API->>DB: Query command history
    API->>Web: Return paginated results
```

### 2. Feature Toggle Flow

```mermaid
sequenceDiagram
    participant Admin as Administrator
    participant Web as Web Dashboard
    participant API as SetAI API
    participant Redis as Redis
    participant Bot as Discord Bot
    participant DB as MySQL
    
    Admin->>Web: Toggle feature X
    Web->>API: POST /commands/toggle
    API->>DB: Update feature state
    API->>Redis: Publish toggle.command
    Redis->>Bot: Event: toggle.command
    Bot->>Bot: Enable/disable feature
    Bot->>Redis: Publish status.update
    Redis->>API: Event: status.update
    API->>Web: WebSocket: feature toggled
```

## Data Models

### Core Entities

#### Command
```typescript
interface Command {
  id: string;           // Unique identifier
  name: string;         // Command name
  description?: string; // Command description
  enabled: boolean;     // Enable/disable state
  serverId?: string;    // Associated Discord server
  executionCount: number; // Number of times executed
  lastExecuted?: Date;  // Last execution timestamp
  createdAt: Date;      // Record creation time
  updatedAt: Date;      // Last modification time
}
```

#### CommandExecution
```typescript
interface CommandExecution {
  id: string;           // Unique execution ID
  commandId: string;    // Reference to Command
  userId: string;       // Discord user ID
  serverId: string;     // Discord server ID  
  channelId: string;    // Discord channel ID
  status: ExecutionStatus; // running | completed | failed | cancelled
  startedAt: Date;      // Execution start time
  completedAt?: Date;   // Execution completion time
  errorMessage?: string; // Error details if failed
  metadata: object;     // Additional execution context
}
```

#### Server
```typescript
interface Server {
  id: string;           // Discord server ID
  name: string;         // Server name
  ownerId: string;      // Server owner Discord ID
  memberCount: number;  // Current member count
  commandsEnabled: boolean; // Bot enabled state
  configuredAt: Date;   // Initial configuration time
  lastActivity?: Date;  // Last bot activity
  settings: object;     // Server-specific bot settings
}
```

## Integration Patterns

### 1. Event-Driven Communication
- Use Redis Pub/Sub for real-time coordination between API and Bot
- Implement event sourcing for command execution tracking
- Apply CQRS pattern for read/write segregation

### 2. API Design Patterns
- RESTful API design with resource-based URLs
- Consistent error handling and response formats
- Pagination for large datasets
- API versioning strategy

### 3. Data Consistency
- Use database transactions for critical operations
- Implement eventual consistency for cross-service communication
- Cache invalidation strategies for performance