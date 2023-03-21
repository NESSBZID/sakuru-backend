import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities, { TwitchEntity, UserEntity } from '@shared/entities';
import { HttpModule } from '@shared/http/http.module';
import { Agent } from 'https';
import { TasksModule } from './tasks/tasks.module';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    RedisModule.forRootAsync(
      {
        useFactory: (configService: ConfigService) => ({
          config: {
            url: configService.get('REDIS_URL'),
          },
        }),
        inject: [ConfigService],
      },
      true,
    ),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: entities,
        synchronize: false,
        autoLoadEntities: true,
        logging: configService.get('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),
    TasksModule,
    HttpModule.register({
      timeout: 10000,
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, TwitchEntity]),
  ],
  controllers: [TwitchController, Logger],
  providers: [TwitchService, Logger],
})
export class TwitchModule {}
