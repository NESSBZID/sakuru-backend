import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Redis from 'ioredis';
import { globalState } from 'apps/twitch/src/global.state';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

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
