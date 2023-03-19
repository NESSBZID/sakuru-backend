import { Injectable } from '@nestjs/common';
import { IServerStats } from './interfaces/serverStats.interface';

@Injectable()
export class StatisticsService {
  async getServerStats(): Promise<IServerStats> {
    return <IServerStats>'Hello World!';
  }
}
