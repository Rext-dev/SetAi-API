import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { LoggerModule } from './common/logging/logger.module';
import { RedisModule } from './infra/redis/redis.module';

@Module({
  imports: [AppConfigModule, LoggerModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
