import { Injectable } from '@nestjs/common';
import { RedisService } from '../infra/redis/redis.service';

@Injectable()
export class StatusService {
  constructor(private readonly redisService: RedisService) {}

  getSystemStatus() {
    const uptime = process.uptime();
    const environment = process.env.NODE_ENV || 'development';
    const version = process.env.npm_package_version || '0.0.1';

    return {
      system: {
        uptime: Math.floor(uptime),
        version,
        environment,
        timestamp: new Date().toISOString(),
      },
      bot: {
        connected: true, // TODO: Get actual bot connection status from Redis
        guilds: 0, // TODO: Get from Redis pub/sub data
        users: 0, // TODO: Get from Redis pub/sub data
        activeCommands: 0, // TODO: Get from Redis
        queuedCommands: 0, // TODO: Get from Redis
      },
      services: {
        redis: {
          connected: this.redisService ? true : false, // Basic check
          latency: 0, // TODO: Implement Redis ping
        },
        database: {
          connected: true, // TODO: Implement database health check
          latency: 0, // TODO: Implement database ping
        },
      },
    };
  }
}
