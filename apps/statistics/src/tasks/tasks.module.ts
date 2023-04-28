import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MapEntity,
  ScoreEntity,
  StatEntity,
  UserEntity,
  UserProfileHistoryEntity,
} from '@shared/entities';
import { TasksService } from './tasks.service';
import { StatisticsService } from '../statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MapEntity,
      UserEntity,
      ScoreEntity,
      StatEntity,
      UserProfileHistoryEntity,
    ]),
  ],
  providers: [TasksService, StatisticsService],
})
export class TasksModule {}
