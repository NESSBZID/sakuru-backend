import { Controller, Get } from '@nestjs/common';
import { ServerStatsDto } from './dto/serverStats.dto';
import { V1Service } from './v1.service';

@Controller({
  path: '',
  version: '1',
})
export class V1Controller {
  constructor(private readonly v1Service: V1Service) {}

  @Get('server_stats')
  async getServerStats(): Promise<ServerStatsDto> {
    return await this.v1Service.getServerStats();
  }
}
