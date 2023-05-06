import { Module } from '@nestjs/common';
import { VerificationGateway } from './verification.gateway';
import { VerificationService } from './verification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities, { UserEntity } from '@shared/entities';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { UserProfileHistory } from '@shared/entities/userProfileHistory.entity';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([UserEntity, UserProfileHistory]),
  ],
  providers: [VerificationService, VerificationGateway],
})
export class VerificationModule {}
