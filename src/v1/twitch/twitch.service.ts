import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';
import { AxiosError } from 'axios';
import { HttpService } from 'src/http/http.servce';
import { Repository } from 'typeorm';
import { TwitchEntity, UserEntity } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';

const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP =
  'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE =
  'Twitch-Eventsub-Message-Signature'.toLowerCase();

const HMAC_PREFIX = 'sha256=';

@Injectable()
export class TwitchServiceV1 {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(TwitchEntity)
    private readonly twitchRepository: Repository<TwitchEntity>,
    private readonly logger: Logger = new Logger(TwitchServiceV1.name),
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  verifyTwitchWebhook(request: RawBodyRequest<Request>): boolean {
    const hmac = HMAC_PREFIX + this.getHmacSignature(request);

    return hmac === request.headers[TWITCH_MESSAGE_SIGNATURE];
  }

  getHmacMessage(request: RawBodyRequest<Request>): string {
    const messageId = <string>request.headers[TWITCH_MESSAGE_ID];
    const messageTimestamp = <string>request.headers[TWITCH_MESSAGE_TIMESTAMP];
    const messageBody = request.rawBody;

    return messageId + messageTimestamp + messageBody;
  }

  getHmacSignature(request: RawBodyRequest<Request>): string {
    return crypto
      .createHmac('sha256', this.config.get('TWITCH_WEBHOOK_SECRET'))
      .update(this.getHmacMessage(request))
      .digest('hex');
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

  async unsubcribeFromEvent(broadcaster_user_id: string): Promise<void> {
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
}
