import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CustomClientTCP } from '@shared/tcp-client/customClient';
import { catchError, firstValueFrom, take } from 'rxjs';
import {
  IServerRecordsOutput,
  ServerRecordsDto,
} from '../dto/serverRecords.dto';
import { IServerStats } from '../interfaces/serverStats.interface';

@Injectable()
export class StatisticsServiceV1 {
  public readonly logger = new Logger(StatisticsServiceV1.name);

  constructor(
    @Inject('STATISTICS_SERVICE') private statisticsService: CustomClientTCP,
  ) {}

  async onModuleInit() {
    await this.statisticsService.connect();
  }

  async getServerRecords({
    mode: modes,
  }: ServerRecordsDto): Promise<IServerRecordsOutput[]> {
    const response: IServerRecordsOutput[] = [];

    for (const mode of modes) {
      const observable = this.statisticsService
        .send('statistics.server_records.get', mode)
        .pipe(
          take(1),
          catchError((err, caught) => {
            this.logger.error(err?.message, err?.stack);
            return caught;
          }),
        );

      const data = await firstValueFrom(observable).catch((_) => {
        return;
      });

      if (!data) continue;
      response.push(data);
    }

    return response;
  }

  async getServerStats(): Promise<IServerStats> {
    const observable = this.statisticsService
      .receive('statistics.server_stats.get')
      .pipe(
        take(1),
        catchError((err, caught) => {
          this.logger.error(err?.message, err?.stack);
          return caught;
        }),
      );

    const data = await firstValueFrom(observable).catch((_) => {
      throw new NotFoundException('No data found.');
    });

    return data as IServerStats;
  }
}
