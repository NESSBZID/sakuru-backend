import { Injectable } from '@nestjs/common';
import { globalState } from './global.state';
import { IServerRecords } from '@shared/interfaces/responses/serverRecords.interface';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { GameModes } from '@shared/enums/GameModes.enum';
import IServerStats from '@shared/interfaces/responses/serverStats.interface';
import IUsersGraphsResponse from '@shared/interfaces/responses/userGraphs.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileHistoryEntity } from '@shared/entities';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(UserProfileHistoryEntity)
    private readonly userProfileHistroyRepository: Repository<UserProfileHistoryEntity>,
  ) {}

  getServerRecords(mode: string): IServerRecords {
    return globalState.serverRecords[mode];
  }

  getServerStats(): IServerStats {
    return globalState.serverStats;
  }

  async getUserGlobalRank(userId: number, mode: number): Promise<number> {
    const rank = await this.redisClient.zrevrank(
      `sakuru:leaderboard:${GameModes[mode]}`,
      userId,
    );

    if (rank === null) {
      return 0;
    } else {
      return rank + 1;
    }
  }

  async getUserCountryRank(
    userId: number,
    mode: number,
    country: string,
  ): Promise<number> {
    const rank = await this.redisClient.zrevrank(
      `sakuru:leaderboard:${GameModes[mode]}:${country}`,
      userId,
    );

    if (rank === null) {
      return 0;
    } else {
      return rank + 1;
    }
  }

  async getUsersGraphs(
    userId: number,
    mode: GameModes,
  ): Promise<IUsersGraphsResponse> {
    const userData = await this.userProfileHistroyRepository.find({
      select: ['pp', 'rank', 'country_rank', 'captured_at'],
      where: {
        mode: mode,
        user_id: userId,
      },
      order: {
        captured_at: 'DESC',
      },
    });

    if (userData.length === 0) throw new RpcException('UserData not found.');

    return {
      mode: mode,
      data: userData,
    };
  }
}
