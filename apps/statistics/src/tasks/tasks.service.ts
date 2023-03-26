import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MapEntity, ScoreEntity, UserEntity } from '@shared/entities';
import { GameModes } from '@shared/enums/GameModes.enum';
import { isNumber } from '@shared/shared.utils';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { globalState } from '../global.state';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(MapEntity)
    private readonly mapRepository: Repository<MapEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ScoreEntity)
    private readonly scoreRepository: Repository<ScoreEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.updateServerRecords();
    await this.updateServerStats();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateServerRecords(): Promise<void> {
    this.logger.log('Updating ServerRecords...');

    for (const mode of Object.values(GameModes)) {
      if (!isNumber(mode)) continue;
      const scoreData = await this.scoreRepository.findOne({
        where: {
          mode: mode,
          status: 2,
        },
        order: {
          pp: 'DESC',
        },
      });

      if (!scoreData) continue;

      const mapData = await this.mapRepository.findOneBy({
        md5: scoreData.map_md5,
      });
      const userData = await this.userRepository.findOneBy({
        id: scoreData.userid,
      });

      globalState.serverRecords[mode] = {
        username: userData.name,
        userid: userData.id,
        pp: scoreData.pp,
        set_id: mapData.set_id,
        beatmap_id: mapData.id,
      };
    }

    this.logger.log('Done updating ServerRecords!');
  }

  @Cron('0 */1 * * * *')
  async updateServerStats(): Promise<void> {
    this.logger.log('Updating ServerStats...');

    globalState.serverStats.players_total = await this.userRepository.count();
    globalState.serverStats.players_online = await this.redis.llen(
      'sakuru:online_players',
    );
    globalState.serverStats.multiplayer_matches = await this.redis.llen(
      'sakuru:multiplayer_matches',
    );
    globalState.serverStats.custom_ranked_maps_count =
      await this.mapRepository.count({
        where: {
          frozen: true,
        },
      });

    this.logger.log('Done updating ServerStats!');
  }
}
