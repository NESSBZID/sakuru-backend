import { Injectable, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';

const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP =
  'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE =
  'Twitch-Eventsub-Message-Signature'.toLowerCase();

const HMAC_PREFIX = 'sha256=';

@Injectable()
export class TwitchServiceV1 {
  constructor(private readonly config: ConfigService) {}

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
}
