import { Module } from '@nestjs/common';
import { StatisticsServiceV1 } from './statistics.service';
import { StatisticsControllerV1 } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapEntity, UserEntity } from '@shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MapEntity])],
  providers: [StatisticsServiceV1],
  controllers: [StatisticsControllerV1],
})
export class StatisticsModuleV1 {}
