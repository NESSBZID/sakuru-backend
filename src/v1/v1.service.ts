import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { MapEntity, UserEntity } from 'src/entities';
import { Repository } from 'typeorm';
import { IServerStats } from './interfaces/serverStats.interface';

@Injectable()
export class V1Service {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MapEntity)
    private readonly mapRepository: Repository<MapEntity>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getServerStats(): Promise<IServerStats> {
    const playersTotal = await this.userRepository.count();
    const playersOnline = await this.redis.llen('sakuru:online_players');
    const multiplayerMatches = await this.redis.llen(
      'sakuru:multiplayer_matches',
    );
    const customRankedMapsCount = await this.mapRepository.count({
      where: {
        frozen: true,
      },
    });

    return {
      players_total: playersTotal,
      players_online: playersOnline,
      multiplayer_matches: multiplayerMatches,
      custom_ranked_maps_count: customRankedMapsCount,
    };
  }
}
