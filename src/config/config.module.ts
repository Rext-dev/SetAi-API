import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './validation.schema';
import { buildConfig } from './configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (raw: Record<string, unknown>) => {
        const parsed = envSchema.safeParse(raw);
        if (!parsed.success) {
          const issue = parsed.error.issues[0];
          throw new Error(`Invalid environment variable ${issue.path.join('.')}: ${issue.message}`);
        }
        return parsed.data;
      },
      load: [() => buildConfig(envSchema.parse(process.env))],
    }),
  ],
  providers: [
    {
      provide: 'APP_CONFIG',
      useFactory: () => buildConfig(envSchema.parse(process.env)),
    },
  ],
  exports: ['APP_CONFIG'],
})
export class AppConfigModule {}
