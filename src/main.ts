import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW || 60000),
      max: Number(process.env.RATE_LIMIT_MAX || 100),
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  const prefix = process.env.API_GLOBAL_PREFIX || '/api';
  app.setGlobalPrefix(prefix);
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
void bootstrap();
