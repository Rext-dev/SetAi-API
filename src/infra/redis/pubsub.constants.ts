// Redis channel constants (TODO implement publishers/subscribers)
export const REDIS_CHANNELS = {
  TOGGLE: 'toggle',
  RELOAD: 'reload',
  STATUS_UPDATE: 'status.update',
  COMMANDS_STATE: 'commands.state',
  HEARTBEAT: 'heartbeat',
} as const;

export type RedisChannel = (typeof REDIS_CHANNELS)[keyof typeof REDIS_CHANNELS];
