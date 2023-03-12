import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import Redis from 'ioredis';
import { globalState } from 'src/global.state';
import { HttpService } from 'src/http/http.servce';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.updateRecordsCache();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateRecordsCache(): Promise<void> {
    this.logger.log('Updating ServerRecords...');

    for (const mode of [
      [0, 'standard'],
      [4, 'relax'],
    ]) {
      const {
        data: { data: score },
      } = await this.httpService.get(
        this.config.get('BANCHO_API') + '/scores',
        {
          params: {
            status: 2,
            mode: mode[0],
            page_size: 1,
            sort_by: 'pp',
            sort_order: 'desc',
          },
        },
      );
      const {
        data: { data: player },
      } = await this.httpService.get(
        this.config.get('BANCHO_API') + `/players/${score[0].userid}`,
      );
      const {
        data: { data: map },
      } = await this.httpService.get(
        this.config.get('BANCHO_API') + `/maps/${score[0].map_md5}`,
      );

      globalState.serverRecords[mode[1]] = {
        username: player.name,
        userid: player.id,
        user_link: `https://${this.config.get('BASE_DOMAIN')}/u/${player.id}`,
        pp: score[0].pp,
        set_id: map.set_id,
        beatmap_id: map.id,
      };
    }

    this.logger.log('Done updating ServerRecords!');
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkTwitchStreamers(): Promise<void> {
    const currentLength = globalState.tiwtchStreamers.length;
    if (currentLength === 0) {
      this.logger.log('No streamers to check.');
    }

    this.logger.log(`Checking ${currentLength} streamer(s)...`);

    const streamersData = await globalState.twitchClient.getStreams({
      channels: globalState.tiwtchStreamers.map(
        (streamer) => streamer.twitch_id,
      ),
    });

    for (const streamerData of streamersData.data) {
      const curretState = globalState.tiwtchStreamers.find(
        (streamer) => streamer.twitch_id === streamerData.user_id,
      );
      const timeDifference =
        new Date().getTime() - new Date(streamerData.started_at).getTime();

      if (timeDifference / 1000 < 160) continue;

      if (streamerData.game_id === '21465') {
        const isOnline = await this.redis.lpos(
          'sakuru:online_players',
          curretState.osu_id,
        );

        if (isOnline !== null) continue;
      }

      globalState.tiwtchStreamers.splice(
        globalState.tiwtchStreamers.indexOf(curretState),
        1,
      );
    }

    this.logger.log(
      `Done! ${
        currentLength - globalState.tiwtchStreamers.length
      } streamer(s) were removed.`,
    );
  }
}
