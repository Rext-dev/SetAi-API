import { EnvVars } from './validation.schema';

export const buildConfig = (env: EnvVars) => ({
  env: env.NODE_ENV,
  port: env.PORT,
  apiPrefix: env.API_GLOBAL_PREFIX,
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  security: {
    rateLimit: {
      max: env.RATE_LIMIT_MAX,
      windowMs: env.RATE_LIMIT_WINDOW,
    },
    jwt: {
      secret: env.AUTH_JWT_SECRET,
      expiresIn: env.AUTH_JWT_EXPIRES,
    },
  },
  features: {
    metrics: env.METRICS_ENABLED,
  },
});

export type AppConfig = ReturnType<typeof buildConfig>;
