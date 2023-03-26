import TwitchApi from '@alowave223/node-twitch';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, TwitchEntity } from '@shared/entities';
import { HttpService } from '@shared/http/http.servce';
import { AxiosError } from 'axios';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { globalState } from './global.state';

@Injectable()
export class TwitchService {
  private readonly logger: Logger = new Logger(TwitchService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(TwitchEntity)
    private readonly twitchRepository: Repository<TwitchEntity>,
    @InjectRedis() private readonly redis: Redis,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Connecting to Twitch...', 'AppBootstrap');

    // Connect to Twitch API.
    globalState.twitchClient = new TwitchApi({
      client_id: this.config.get('TWITCH_CLIENT_ID'),
      client_secret: this.config.get('TWITCH_CLIENT_SECRET'),
    });
    const tiwtchAccessToken = await globalState.twitchClient.getAccessToken();

    // Set default headers for Twitch API.
    this.httpService.axiosRef.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${tiwtchAccessToken}`;
    this.httpService.axiosRef.defaults.headers.common['Client-ID'] =
      this.config.get('TWITCH_CLIENT_ID');
    this.httpService.axiosRef.defaults.headers.common['Content-Type'] =
      'application/json';

    this.logger.log('Successfully connected to Twitch!', 'AppBootstrap');
  }

  async getUserByTwitch(twitch_id: string): Promise<UserEntity> | null {
    const twitchData = await this.twitchRepository.findOne({
      where: {
        twitch_id: parseInt(twitch_id),
      },
    });

    if (twitchData) {
      return await this.usersRepository.findOne({
        where: {
          id: twitchData.osu_id,
        },
      });
    } else {
      return null;
    }
  }

  async unsubscribeFromEvent(broadcaster_user_id: string): Promise<void> {
    this.httpService
      .get('https://api.twitch.tv/helix/eventsub/subscriptions')
      .then(async (response) => {
        for (const subscription of response.data.data) {
          if (
            subscription.condition.broadcaster_user_id === broadcaster_user_id
          ) {
            await this.httpService
              .delete(`/eventsub/subscriptions`, {
                params: {
                  id: subscription.id,
                },
              })
              .catch((error: AxiosError) => {
                this.logger.error(error, 'TwitchWebhook');
                throw new BadRequestException(error.message, {
                  cause: error.cause,
                });
              });

            this.logger.log(
              `Unsubscribed from ${subscription.type} (${broadcaster_user_id})`,
              'TwitchWebhook',
            );
          }
        }
      });
  }

  async subscribeToEvent(broadcaster_user_id: string): Promise<void> {
    for (const type of ['stream.online', 'stream.offline']) {
      await this.httpService
        .post('https://api.twitch.tv/helix/eventsub/subscriptions', {
          type: type,
          version: '1',
          condition: {
            broadcaster_user_id: broadcaster_user_id,
          },
          transport: {
            method: 'webhook',
            callback: `https://${this.config.get(
              'BASE_DOMAIN',
            )}/api/v1/twitch/webhook`,
            secret: this.config.get('TWITCH_WEBHOOK_SECRET'),
          },
        })
        .catch((error: AxiosError) => {
          this.logger.error(error, 'TwitchWebhook');
          if (error.status === 409) {
            throw new ConflictException('This user is already have webhook.', {
              cause: error.cause,
            });
          } else {
            throw new BadRequestException(error.message, {
              cause: error.cause,
            });
          }
        });

      this.logger.log(
        `Subscribed to ${type} (${broadcaster_user_id})`,
        'TwitchWebhook',
      );
    }
  }

  async wentOnlineWebhook(streamerLogin: string) {
    const {
      data: [stream],
    } = await globalState.twitchClient.getStreams({ channel: streamerLogin });

    const user = await this.getUserByTwitch(stream.user_id);
    if (!user) return;

    const isOnline = await this.redis.lpos('sakuru:online_players', user.id);
    if (isOnline === null) return;

    globalState.tiwtchStreamers.push({
      osu_id: user.id,
      twitch_id: stream.user_id,
      title: stream.title,
      username: stream.user_name,
      thumb_url: stream.getThumbnailUrl({
        width: 1920,
        height: 1080,
      }),
    });

    this.logger.log(
      `Added ${user.name} (${stream.user_id}) to the streamers list.`,
    );
  }

  async wentOfflineWebhook(streamerId: string) {
    const streamerIndex = globalState.tiwtchStreamers.findIndex(
      (streamer) => streamer.twitch_id === streamerId,
    );

    if (streamerIndex === -1) return;

    globalState.tiwtchStreamers.splice(streamerIndex, 1);
    this.logger.log(`Removed ${streamerId} from the streamers list.`);
  }
}
