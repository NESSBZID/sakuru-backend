import { ClassSerializerInterceptor, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { V1Module } from './v1/v1.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@shared/http/http.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Agent } from 'https';
import entities from '@shared/entities';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRootAsync(
      {
        useFactory: (configService: ConfigService) => ({
          closeClient: true,
          config: [
            {
              url: configService.get('REDIS_URL'),
              connectionName: 'default',
              namespace: 'default',
              enableAutoPipelining: true,
            },
            {
              url: configService.get('REDIS_URL'),
              connectionName: 'subscriber',
              namespace: 'subscriber',
              enableAutoPipelining: true,
            },
          ],
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
    V1Module,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    AppService,
    Logger,
  ],
  exports: [Logger, HttpModule],
})
export class AppModule {}
