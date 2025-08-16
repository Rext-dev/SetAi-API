import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { LoggerModule } from './common/logging/logger.module';
import { RedisModule } from './infra/redis/redis.module';
import { StatusModule } from './status/status.module';
import { CommandsModule } from './commands/commands.module';
import { ServersModule } from './servers/servers.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    RedisModule,
    StatusModule,
    CommandsModule,
    ServersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
