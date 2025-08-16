import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CHANNELS } from './pubsub.constants';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private pub: Redis; // TODO lazy connection
  private sub: Redis;

  constructor() {
    const host = process.env.REDIS_HOST;
    const enabled = process.env.REDIS_ENABLED === 'true';
    if (host && enabled) {
      this.pub = new Redis({
        host,
        port: Number(process.env.REDIS_PORT || 6379),
        lazyConnect: true,
      });
      this.sub = new Redis({
        host,
        port: Number(process.env.REDIS_PORT || 6379),
        lazyConnect: true,
      });
    } else {
      // @ts-expect-error intentionally undefined until enabled
      this.pub = undefined;
      // @ts-expect-error intentionally undefined until enabled
      this.sub = undefined;
    }
  }

  async onModuleInit() {
    // Subscribe to channels (placeholder handlers)
    if (!this.sub) return;
    await this.sub.connect();
    await this.pub.connect();
    await this.sub.subscribe(...Object.values(REDIS_CHANNELS));
    this.sub.on('message', (channel, message) => {
      // TODO route messages to internal event bus / handlers
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[redis][sub] ${channel} -> ${message}`);
      }
    });
  }

  async publish(channel: string, payload: unknown) {
    if (!this.pub) return;
    await this.pub.publish(channel, JSON.stringify(payload));
  }

  async onModuleDestroy() {
    if (this.pub) await this.pub.quit();
    if (this.sub) await this.sub.quit();
  }
}
