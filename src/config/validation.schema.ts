import { z } from 'zod';

// Central schema for environment variables. Fail-fast on startup.
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_GLOBAL_PREFIX: z.string().startsWith('/').default('/api'),
  // Permitir cadena que empiece por mysql:// aunque no sea una URL completamente válida para zod url()
  DATABASE_URL: z.string().refine((v) => v.startsWith('mysql://'), {
    message: 'Must start with mysql://',
  }),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  METRICS_ENABLED: z.string().transform((v) => v === 'true' || v === '1'),
  AUTH_JWT_SECRET: z.string().min(8),
  AUTH_JWT_EXPIRES: z.string().default('3600s'),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW: z.coerce.number().int().positive().default(60000),
});

export type EnvVars = z.infer<typeof envSchema>;
