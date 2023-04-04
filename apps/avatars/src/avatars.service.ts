import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  IAvatarsDeleteMessage,
  IAvatarsSetMessage,
} from '@shared/interfaces/messages/avatars.interface';
import { unlinkSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

@Injectable()
export class AvatarsService {
  constructor(private readonly configService: ConfigService) {}

  deleteAvatar({ user_id }: IAvatarsDeleteMessage): void {
    const savePath = path.join(
      this.configService.get('AVATARS_PATH'),
      user_id.toString() + '.png',
    );

    try {
      unlinkSync(savePath);
    } catch (err) {
      throw new BadRequestException(err.name, {
        description: err.message,
      });
    }
  }

  async saveAvatar({ image, user_id }: IAvatarsSetMessage): Promise<void> {
    const savePath = path.join(
      this.configService.get('AVATARS_PATH'),
      user_id.toString() + '.png',
    );
    let avatar = sharp(image);

    const avatarMetadata = await avatar.metadata();

    if (avatarMetadata.width > avatarMetadata.height) {
      const x = (avatarMetadata.width - avatarMetadata.height) / 2;

      avatar = avatar.extract({
        width: avatarMetadata.height,
        height: avatarMetadata.height,
        left: x,
        top: 0,
      });
    } else {
      const y = (avatarMetadata.height - avatarMetadata.width) / 2;

      avatar = avatar.extract({
        width: avatarMetadata.width,
        height: avatarMetadata.width,
        left: 0,
        top: y,
      });
    }

    avatar.resize(256, 256).toFile(savePath, (err, _) => {
      if (err)
        throw new BadRequestException(err.name, {
          description: err.message,
        });
    });
  }
}
