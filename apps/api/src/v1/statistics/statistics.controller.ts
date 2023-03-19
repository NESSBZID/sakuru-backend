import { Controller, Get, Query } from '@nestjs/common';
import { ServerTopScoresInput } from '../dto/serverTopScores.dto';
import { StatisticsServiceV1 } from './statistics.service';

@Controller({
  path: 'statistics',
  version: '1',
})
export class StatisticsControllerV1 {
  constructor(private readonly statisticsService: StatisticsServiceV1) {}

  @Get('server_records')
  async getServerRecords(@Query() query: ServerTopScoresInput) {
    return await this.statisticsService.getServerTopScores(query);
  }
}
