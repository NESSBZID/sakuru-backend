import { Controller, Get } from '@nestjs/common';
import { AvatarsService } from './avatars.service';

@Controller()
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Get()
  getHello(): string {
    return this.avatarsService.getHello();
  }
}
