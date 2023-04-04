import { Controller } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type {
  IAvatarsDeleteMessage,
  IAvatarsSetMessage,
} from '@shared/interfaces/messages/avatars.interface';

@Controller()
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @MessagePattern('avatars.set')
  async setAvatar(@Payload() message: IAvatarsSetMessage): Promise<void> {
    return await this.avatarsService.saveAvatar(message);
  }

  @MessagePattern('avatars.delete')
  deleteAvatar(@Payload() message: IAvatarsDeleteMessage): void {
    return this.avatarsService.deleteAvatar(message);
  }
}
