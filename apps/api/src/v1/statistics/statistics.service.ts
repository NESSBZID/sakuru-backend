import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { MapEntity, UserEntity } from '@shared/entities';
import { checkValidModsCombination } from 'apps/api/src/utils';
import { Repository } from 'typeorm';
import {
  ServerTopScoresInput,
  ServerTopScoresOutput,
} from '../dto/serverTopScores.dto';
import { IServerStats } from '../interfaces/serverStats.interface';

@Injectable()
export class StatisticsServiceV1 {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MapEntity)
    private readonly mapRepository: Repository<MapEntity>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getServerTopScores({
    mode,
    mods,
  }: ServerTopScoresInput): Promise<ServerTopScoresOutput> {
    if (!checkValidModsCombination(mode, mods))
      throw new BadRequestException('Invalid mods combination.');

    const topScoreRaw = await this.redis.get(
      `sakuru:cache:top:${mods}:${mode}`,
    );

    if (!topScoreRaw)
      throw new NotFoundException(
        'No top scores found for this mod combination.',
      );

    return JSON.parse(topScoreRaw);
  }

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
