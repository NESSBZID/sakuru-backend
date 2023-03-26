import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapEntity, ScoreEntity, UserEntity } from '@shared/entities';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([MapEntity, UserEntity, ScoreEntity])],
  providers: [TasksService],
})
export class TasksModule {}
