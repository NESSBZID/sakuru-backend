import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Redis from 'ioredis';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateServerTopScores(): Promise<void> {
    throw new NotImplementedException();
  }
}
