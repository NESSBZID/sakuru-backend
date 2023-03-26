import { Controller, Get, Query } from '@nestjs/common';
import {
  IServerRecordsOutput,
  ServerRecordsDto,
} from '../dto/serverRecords.dto';
import { StatisticsServiceV1 } from './statistics.service';

@Controller({
  path: 'statistics',
  version: '1',
})
export class StatisticsControllerV1 {
  constructor(private readonly statisticsService: StatisticsServiceV1) {}

  @Get('server_records')
  async getServerRecords(
    @Query() query: ServerRecordsDto,
  ): Promise<IServerRecordsOutput[]> {
    return this.statisticsService.getServerRecords(query);
  }

  @Get('server_stats')
  async getServerStats() {
    return await this.statisticsService.getServerStats();
  }
}
