import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IServerRecords } from '../../../libs/shared/src/interfaces/responses/serverRecords.interface';
import { StatisticsService } from './statistics.service';
import IServerStats from '@shared/interfaces/responses/serverStats.interface';
import IUserGraphsResponse from '@shared/interfaces/responses/userGraphs.interface';
import UsersGraphsGetMessageDto from './dto/usersGraphs.dto';
import { ExceptionFilter } from '@shared/filters/rpc-exception.filter';

@UseFilters(new ExceptionFilter())
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

  @MessagePattern('statistics.users_graphs.get')
  async getUsersGraphs(
    @Payload() { userId, mode }: UsersGraphsGetMessageDto,
  ): Promise<IUserGraphsResponse> {
    return await this.appService.getUsersGraphs(userId, mode);
  }
}
