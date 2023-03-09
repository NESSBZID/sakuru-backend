import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { MapEntity, UserEntity } from 'src/entities';
import { Repository } from 'typeorm';
import { ServerStatsDto } from './dto/serverStats.dto';

@Injectable()
export class V1Service {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MapEntity)
    private readonly mapRepository: Repository<MapEntity>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getServerStats(): Promise<ServerStatsDto> {
    const playersTotal = await this.userRepository.count();
    const playersOnline = await this.redis.llen('sakuru:online_players');
    const customRankedMapsCount = await this.mapRepository.count({
      where: {
        frozen: true,
      },
    });

    return {
      players_total: playersTotal,
      players_online: playersOnline,
      custom_ranked_maps_count: customRankedMapsCount,
    };
  }
}
