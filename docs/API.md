# SetAI API - Endpoints Documentation

This document describes the REST API endpoints for the SetAI control plane.

## Base URL

All API endpoints are prefixed with `/api` (configurable via `API_GLOBAL_PREFIX` environment variable).

**Base URL**: `https://your-domain.com/api`

## Authentication

> **Note**: Authentication is planned for future implementation using JWT tokens with role-based access control.

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "statusCode": 400,
  "message": "Detailed error message",
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/endpoint"
}
```

## Endpoints

### System Status

#### GET /status

Returns the current system and bot status information.

**Response**: `200 OK`

```json
{
  "system": {
    "uptime": 86400,
    "version": "0.0.1",
    "environment": "production",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "bot": {
    "connected": true,
    "guilds": 25,
    "users": 1500,
    "activeCommands": 3,
    "queuedCommands": 0
  },
  "services": {
    "redis": {
      "connected": true,
      "latency": 2
    },
    "database": {
      "connected": true,
      "latency": 15
    }
  }
}
```

**Error Responses**:
- `503 Service Unavailable`: When system is experiencing issues

---

### Commands Management

#### GET /commands/history

Returns paginated list of executed commands with their execution history.

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)  
- `status` (optional): Filter by execution status (`running`, `completed`, `failed`, `cancelled`)
- `serverId` (optional): Filter by Discord server ID
- `userId` (optional): Filter by Discord user ID
- `startDate` (optional): Filter executions after this date (ISO 8601)
- `endDate` (optional): Filter executions before this date (ISO 8601)

**Response**: `200 OK`

```json
{
  "data": [
    {
      "id": "exec_1234567890",
      "command": {
        "id": "cmd_001",
        "name": "setup-roles",
        "description": "Configure server roles"
      },
      "user": {
        "id": "123456789012345678",
        "username": "user123"
      },
      "server": {
        "id": "987654321098765432", 
        "name": "My Discord Server"
      },
      "channel": {
        "id": "555444333222111000",
        "name": "general"
      },
      "status": "completed",
      "startedAt": "2024-01-15T10:15:00.000Z",
      "completedAt": "2024-01-15T10:15:30.000Z", 
      "duration": 30000,
      "errorMessage": null,
      "metadata": {
        "rolesCreated": 5,
        "permissions": ["MANAGE_ROLES"]
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Database query failed

---

#### GET /commands/{id}

Returns detailed information about a specific command execution.

**Path Parameters**:
- `id`: Command execution ID

**Response**: `200 OK`

```json
{
  "id": "exec_1234567890",
  "command": {
    "id": "cmd_001", 
    "name": "setup-roles",
    "description": "Configure server roles",
    "enabled": true
  },
  "user": {
    "id": "123456789012345678",
    "username": "user123",
    "discriminator": "1234",
    "avatar": "https://cdn.discordapp.com/avatars/..."
  },
  "server": {
    "id": "987654321098765432",
    "name": "My Discord Server", 
    "memberCount": 150,
    "icon": "https://cdn.discordapp.com/icons/..."
  },
  "channel": {
    "id": "555444333222111000",
    "name": "general",
    "type": "GUILD_TEXT"
  },
  "status": "completed",
  "startedAt": "2024-01-15T10:15:00.000Z",
  "completedAt": "2024-01-15T10:15:30.000Z",
  "duration": 30000,
  "errorMessage": null,
  "logs": [
    {
      "timestamp": "2024-01-15T10:15:05.000Z",
      "level": "info", 
      "message": "Started role configuration"
    },
    {
      "timestamp": "2024-01-15T10:15:25.000Z",
      "level": "info",
      "message": "Created role 'Moderator' with permissions"
    }
  ],
  "metadata": {
    "originalMessage": "/setup-roles moderator admin helper",
    "rolesCreated": 5,
    "permissions": ["MANAGE_ROLES", "KICK_MEMBERS"],
    "executionSteps": 8
  }
}
```

**Error Responses**:
- `404 Not Found`: Command execution not found
- `500 Internal Server Error`: Database query failed

---

#### POST /commands/toggle

Enable or disable a specific bot command. This publishes a toggle event to Redis for the bot to consume.

**Request Body**:
```json
{
  "commandName": "setup-roles",
  "enabled": false,
  "serverId": "987654321098765432"
}
```

**Request Schema**:
- `commandName` (required): Name of the command to toggle
- `enabled` (required): Boolean indicating if command should be enabled
- `serverId` (optional): Specific server ID to apply toggle (global if omitted)

**Response**: `200 OK`

```json
{
  "success": true,
  "command": {
    "name": "setup-roles",
    "enabled": false,
    "serverId": "987654321098765432",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Command toggle event published successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request body or command name
- `404 Not Found`: Command not found
- `500 Internal Server Error`: Redis publish failed

---

### Server Management

#### GET /servers/{id}/summary

Returns a comprehensive summary of a Discord server including configuration, statistics, and recent activity.

**Path Parameters**:
- `id`: Discord server ID

**Response**: `200 OK`

```json
{
  "server": {
    "id": "987654321098765432",
    "name": "My Discord Server",
    "description": "A community server for gaming",
    "memberCount": 150,
    "owner": {
      "id": "111222333444555666",
      "username": "serverowner",
      "discriminator": "0001"
    },
    "createdAt": "2023-06-15T14:20:00.000Z",
    "icon": "https://cdn.discordapp.com/icons/...",
    "features": ["COMMUNITY", "WELCOME_SCREEN_ENABLED"]
  },
  "botConfiguration": {
    "enabled": true,
    "configuredAt": "2024-01-01T12:00:00.000Z",
    "lastActivity": "2024-01-15T10:25:00.000Z",
    "commandsEnabled": [
      "setup-roles",
      "manage-channels", 
      "moderation-tools"
    ],
    "commandsDisabled": [
      "auto-delete",
      "welcome-message"
    ],
    "settings": {
      "prefix": "/",
      "autoModeration": true,
      "logChannel": "555444333222111001",
      "welcomeChannel": "555444333222111002"
    }
  },
  "statistics": {
    "totalCommands": 245,
    "commandsLast24h": 12,
    "commandsLast7d": 89,
    "topCommands": [
      {
        "name": "setup-roles",
        "count": 45,
        "lastUsed": "2024-01-15T09:30:00.000Z"
      },
      {
        "name": "manage-channels", 
        "count": 38,
        "lastUsed": "2024-01-14T16:45:00.000Z"
      }
    ],
    "activeUsers": 23,
    "newMembersLast7d": 8
  },
  "channels": {
    "total": 25,
    "categories": [
      {
        "id": "777888999000111222",
        "name": "General",
        "channelCount": 5
      },
      {
        "id": "777888999000111223", 
        "name": "Gaming",
        "channelCount": 8
      }
    ]
  },
  "roles": {
    "total": 12,
    "managed": [
      {
        "id": "444555666777888999",
        "name": "Moderator",
        "color": "#ff0000",
        "memberCount": 5
      },
      {
        "id": "444555666777889000",
        "name": "Helper", 
        "color": "#00ff00",
        "memberCount": 12
      }
    ]
  },
  "recentActivity": [
    {
      "type": "command_executed",
      "timestamp": "2024-01-15T10:25:00.000Z",
      "details": {
        "command": "setup-roles",
        "user": "user123",
        "status": "completed"
      }
    },
    {
      "type": "member_joined",
      "timestamp": "2024-01-15T09:45:00.000Z", 
      "details": {
        "userId": "999888777666555444",
        "username": "newuser"
      }
    }
  ]
}
```

**Error Responses**:
- `404 Not Found`: Server not found or bot not configured for server
- `403 Forbidden`: Insufficient permissions to access server data
- `500 Internal Server Error`: Database query failed

---

## WebSocket Events (Future Implementation)

Real-time events will be available via WebSocket connections:

### Connection
```
ws://your-domain.com/api/ws
```

### Event Types
- `command.started` - New command execution started
- `command.completed` - Command execution finished
- `command.failed` - Command execution failed
- `status.update` - System status changed
- `server.activity` - New activity in monitored server

### Example Event
```json
{
  "type": "command.completed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "executionId": "exec_1234567890", 
    "commandName": "setup-roles",
    "status": "completed",
    "duration": 30000,
    "serverId": "987654321098765432"
  }
}
```

## Rate Limiting

All endpoints are subject to rate limiting:
- **Default**: 100 requests per minute per IP
- **Configurable** via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW` environment variables

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95  
X-RateLimit-Reset: 1642248000
```

## Data Formats

### Timestamps
All timestamps are in ISO 8601 format with UTC timezone: `2024-01-15T10:30:00.000Z`

### IDs
- Command execution IDs: `exec_` prefix + unique identifier
- Command IDs: `cmd_` prefix + unique identifier  
- Discord IDs: 18-digit snowflake strings

### Pagination
Standard pagination format used across all paginated endpoints:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20, 
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```