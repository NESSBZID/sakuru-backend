import { Logger, Module } from '@nestjs/common';
import { V1Service } from './v1.service';
import { V1Controller } from './v1.controller';
import { AuthModuleV1 } from './auth/auth.module';
import { UsersModuleV1 } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapEntity, TwitchEntity, UserEntity } from 'src/entities';
import { TwitchServiceV1 } from './twitch/twitch.service';
import { TwitchControllerV1 } from './twitch/twitch.controller';
import { TwitchModuleV1 } from './twitch/twitch.module';
import { HttpModule } from 'src/http/http.module';

@Module({
  imports: [
    AuthModuleV1,
    UsersModuleV1,
    TypeOrmModule.forFeature([UserEntity, MapEntity, TwitchEntity]),
    TwitchModuleV1,
  ],
  providers: [V1Service, TwitchServiceV1, Logger, HttpModule],
  controllers: [V1Controller, TwitchControllerV1],
})
export class V1Module {}
