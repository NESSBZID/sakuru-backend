import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IServerStats } from 'apps/api/src/v1/interfaces/serverStats.interface';
import { StatisticsService } from './statistics.service';

@Controller()
export class StatisticsController {
  constructor(private readonly appService: StatisticsService) {}

  @MessagePattern('statistics.get.server_stats')
  async getServerStats(): Promise<IServerStats> {
    return await this.appService.getServerStats();
  }
}
