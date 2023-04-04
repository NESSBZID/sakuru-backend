import { Injectable } from '@nestjs/common';
import { globalState } from './global.state';
import { IServerRecords } from './interfaces/serverRecords.interface';
import { IServerStats } from './interfaces/serverStats.interface';

@Injectable()
export class StatisticsService {
  getServerRecords(mode: string): IServerRecords {
    return globalState.serverRecords[mode];
  }

  getServerStats(): IServerStats {
    return globalState.serverStats;
  }
}
