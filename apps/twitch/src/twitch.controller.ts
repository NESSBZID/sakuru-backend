import { Controller, Get } from '@nestjs/common';
import { TwitchService } from './twitch.service';

@Controller()
export class TwitchController {
  constructor(private readonly twitchService: TwitchService) {}

  @Get()
  getHello(): string {
    return this.twitchService.getHello();
  }
}
