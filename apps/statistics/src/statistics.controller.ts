import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IServerRecords } from './interfaces/serverRecords.interface';
import { IServerStats } from './interfaces/serverStats.interface';
import { StatisticsService } from './statistics.service';

@Controller()
export class StatisticsController {
  constructor(private readonly appService: StatisticsService) {}

  @MessagePattern('statistics.server_records.get')
  getServerRecords(@Payload() mode: string): IServerRecords {
    return this.appService.getServerRecords(mode);
  }

  @MessagePattern('statistics.server_stats.get')
  getServerStats(): IServerStats {
    return this.appService.getServerStats();
  }
}
