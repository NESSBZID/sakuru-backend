import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  Controller,
  Get,
  Logger,
  Post,
  RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import Redis from 'ioredis';
import { globalState } from 'apps/twitch/src/global.state';
import { TwitchServiceV1 } from './twitch.service';

@Controller({
  path: 'twitch',
  version: '1',
})
export class TwitchControllerV1 {
  private readonly logger = new Logger(TwitchControllerV1.name);

  constructor(
    private readonly twitchService: TwitchServiceV1,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post('webhook')
  async twitchWebhook(@Req() request: RawBodyRequest<Request>): Promise<void> {
    if (!this.twitchService.verifyTwitchWebhook(request))
      throw UnauthorizedException;

    if (
      request.headers['twitch-eventsub-message-type'] ===
      'webhook_callback_verification'
    )
      return request.body['challenge'];

    if (request.body['subscription']['type'] === 'stream.online') {
      const stream = await globalState.twitchClient.getStreams({
        channel: request.body['event']['broadcaster_user_login'],
      });
      const user = await this.twitchService.getUserByTwitch(
        stream.data[0].user_id,
      );
      if (!user) return;

      const isOnline = await this.redis.lpos('sakuru:online_players', user.id);
      if (isOnline === null) return;

      globalState.tiwtchStreamers.push({
        osu_id: user.id,
        twitch_id: stream.data[0].user_id,
        title: stream.data[0].title,
        username: stream.data[0].user_name,
        thumb_url: stream.data[0].getThumbnailUrl({
          width: 1920,
          height: 1080,
        }),
      });

      this.logger.log(
        `Added ${user.name} (${stream.data[0].user_id}) to the streamers list.`,
      );
    } else if (request.body['subscription']['type'] === 'stream.offline') {
      const streamerId = request.body['event']['broadcaster_user_id'];
      const streamerIndex = globalState.tiwtchStreamers.findIndex(
        (streamer) => streamer.twitch_id === streamerId,
      );

      if (streamerIndex === -1) return;

      globalState.tiwtchStreamers.splice(streamerIndex, 1);
      this.logger.log(`Removed ${streamerId} from the streamers list.`);
    }
  }

  @Get('streamers')
  async getStreamers(): Promise<any> {
    return {
      streamers: globalState.tiwtchStreamers,
      total: globalState.tiwtchStreamers.length,
    };
  }
}
