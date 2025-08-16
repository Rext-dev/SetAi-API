import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoModule, Params } from 'nestjs-pino';

function resolvePrettyTransport() {
  const env = process.env.NODE_ENV;
  // Sólo intentar en entornos no productivos
  if (!env || env === 'production') return undefined;
  try {
    // Verifica que el paquete exista en runtime (en prod lo elimina prune)
    require.resolve('pino-pretty');
    return { target: 'pino-pretty', options: { colorize: true } } as const;
  } catch {
    // Fallback: no usar transport para evitar crash
    return undefined;
  }
}

@Global()
@Module({
  imports: [
    PinoModule.forRootAsync({
      useFactory: (): Params => ({
        pinoHttp: {
          level: process.env.LOG_LEVEL || 'info',
          transport: resolvePrettyTransport(),
          redact: ['req.headers.authorization'],
        },
      }),
    }),
  ],
  exports: [PinoModule],
})
export class LoggerModule {}
