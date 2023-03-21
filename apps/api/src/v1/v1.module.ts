import { Logger, Module } from '@nestjs/common';
import { V1Service } from './v1.service';
import { V1Controller } from './v1.controller';
import { AuthModuleV1 } from './auth/auth.module';
import { UsersModuleV1 } from './users/users.module';
// import { TwitchModuleV1 } from './twitch/twitch.module';
import { HttpModule } from '@shared/http/http.module';
import { StatisticsModuleV1 } from './statistics/statistics.module';

@Module({
  imports: [AuthModuleV1, UsersModuleV1, StatisticsModuleV1],
  providers: [V1Service, Logger, HttpModule],
  controllers: [V1Controller],
})
export class V1Module {}
