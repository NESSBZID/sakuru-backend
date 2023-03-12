import { Controller, Get } from '@nestjs/common';
import { globalState } from 'src/global.state';
import { IServerRecords } from './interfaces/serverRecords.interface';
import { IServerStats } from './interfaces/serverStats.interface';
import { V1Service } from './v1.service';

@Controller({
  path: '',
  version: '1',
})
export class V1Controller {
  constructor(private readonly v1Service: V1Service) {}

  @Get('server_stats')
  async getServerStats(): Promise<IServerStats> {
    return await this.v1Service.getServerStats();
  }

  @Get('server_records')
  async getServerRecords(): Promise<IServerRecords> {
    return globalState.serverRecords;
  }
}
