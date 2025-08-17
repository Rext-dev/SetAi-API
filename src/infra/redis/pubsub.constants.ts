// Redis channel constants for SetAI API coordination
export const REDIS_CHANNELS = {
  TOGGLE_COMMAND: 'toggle-command',
  STATUS_UPDATE: 'status-update',
  COMMAND_START: 'command.start',
  COMMAND_PROGRESS: 'command.progress',
  COMMAND_COMPLETE: 'command.complete',
  HEARTBEAT: 'heartbeat',
  RELOAD: 'reload',
} as const;

export type RedisChannel = (typeof REDIS_CHANNELS)[keyof typeof REDIS_CHANNELS];
