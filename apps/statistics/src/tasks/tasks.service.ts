import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MapEntity,
  ScoreEntity,
  StatEntity,
  UserEntity,
  UserProfileHistoryEntity,
} from '@shared/entities';
import { GameModes } from '@shared/enums/GameModes.enum';
import { isNumber } from '@shared/shared.utils';
import Redis from 'ioredis';
import { Not, Repository } from 'typeorm';
import { globalState } from '../global.state';
import { StatisticsService } from '../statistics.service';

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
    @InjectRepository(UserProfileHistoryEntity)
    private readonly userProfileHistoryRepository: Repository<UserProfileHistoryEntity>,
    @InjectRepository(StatEntity)
    private readonly statRepository: Repository<StatEntity>,
    private readonly statisticsService: StatisticsService,
  ) {}

  async onApplicationBootstrap() {
    await this.updateServerRecords();
    await this.updateServerStats();
    await this.crawlUsersProfileGraphs();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async crawlUsersProfileGraphs(): Promise<void> {
    this.logger.log('Crawling users graphs...');

    const users = await this.userRepository.find({
      select: ['id', 'priv', 'country'],
      where: {
        priv: Not(1),
      },
    });

    for (const user of users) {
      for (const mode in GameModes) {
        if (isNaN(Number(mode))) continue;

        const toUpdate = {
          pp: null,
          rank: null,
          country_rank: null,
        };

        if (user.priv & 1) {
          const userStatistics = await this.statRepository.findOneBy({
            id: user.id,
            mode: Number(mode),
          });

          if (!userStatistics) continue;

          toUpdate.pp = userStatistics.pp;
          toUpdate.rank = await this.statisticsService.getUserGlobalRank(
            userStatistics.pp,
            Number(mode),
          );
          toUpdate.country_rank =
            await this.statisticsService.getUserCountryRank(
              userStatistics.pp,
              Number(mode),
              user.country,
            );
        } else {
          const currentProfile =
            await this.userProfileHistoryRepository.findOneBy({
              user_id: user.id,
              mode: Number(mode),
            });

          if (!currentProfile) continue;

          toUpdate.pp = currentProfile.pp;
          toUpdate.rank = currentProfile.rank;
          toUpdate.country_rank = currentProfile.country_rank;
        }

        // NOTE: Delete all history records if they older than 90 days
        await this.userProfileHistoryRepository.insert(toUpdate);
      }
    }

    this.logger.log('Done crawling users graphs.');
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
