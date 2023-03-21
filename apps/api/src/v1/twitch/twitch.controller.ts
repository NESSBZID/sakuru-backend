import {
  Controller,
  Inject,
  Post,
  RawBodyRequest,
  Req,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { TwitchServiceV1 } from './twitch.service';
import { ExceptionFilter } from '@shared/filters/rpc-exception.filter';
import { ClientKafka } from '@nestjs/microservices';

@UseFilters(new ExceptionFilter())
@Controller({
  path: 'twitch',
  version: '1',
})
export class TwitchControllerV1 {
  constructor(
    private readonly twitchService: TwitchServiceV1,
    @Inject('TWITCH_SERVICE') private readonly kafkaTwitch: ClientKafka,
  ) {}

  async onServiceInit() {
    [
      'events.subscribe',
      'events.unsubscribe',
      'webhook.online',
      'webhook.offline',
    ].forEach((key) => this.kafkaTwitch.subscribeToResponseOf(`twitch.${key}`));

    await this.kafkaTwitch.connect();
    await this.kafkaTwitch.send('twitch.events.subscribe', '8282828');
  }

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
      this.kafkaTwitch.send(
        'twitch.webhook.online',
        request.body['event']['broadcaster_user_login'],
      );
    } else if (request.body['subscription']['type'] === 'stream.offline') {
      this.kafkaTwitch.send(
        'twitch.webhook.offline',
        request.body['event']['broadcaster_user_id'],
      );
    }
  }
}
