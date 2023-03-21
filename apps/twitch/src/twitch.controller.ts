import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TwitchService } from './twitch.service';

@Controller()
export class TwitchController {
  constructor(private readonly twitchService: TwitchService) {}

  @MessagePattern('twitch.events.subscribe')
  async subscribeToEvent(@Payload() message: string): Promise<void> {
    return this.twitchService.subscribeToEvent(message);
  }

  @MessagePattern('twitch.events.unsubscribe')
  async unsubscribeToEvent(@Payload() message: string): Promise<void> {
    return this.twitchService.unsubscribeFromEvent(message);
  }

  @MessagePattern('twitch.webhook.online')
  async wentOnlineWebhook(@Payload() message: string): Promise<void> {
    return this.twitchService.wentOnlineWebhook(message);
  }

  @MessagePattern('twitch.webhook.offline')
  async wentOfflineWebhook(@Payload() message: string): Promise<void> {
    return this.twitchService.wentOfflineWebhook(message);
  }
}
