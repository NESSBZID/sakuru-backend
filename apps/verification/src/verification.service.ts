import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@shared/entities';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { globalState } from './global.state';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { RedisVerificationMessage } from '@shared/interfaces/verificationGateway.interface';
import Redis from 'ioredis';
import { GameModes } from '@shared/enums/GameModes.enum';

@Injectable()
export class VerificationService {
  private readonly logger: Logger = new Logger(VerificationService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRedis('subscriber') private readonly redis: Redis,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Subscribing to Verification channel...');

    await this.redis.subscribe('verification', (error, count) => {
      if (error)
        return this.logger.error(error.message, error?.stack, error?.name);

      this.logger.log(`Subscribed to ${count} channel(s).`);
    });

    this.redis.on('message', async (channel, message) => {
      if (channel !== 'verification') return;

      const parsedMessage: RedisVerificationMessage = JSON.parse(message);
      const subscription = globalState.verificationQueue.find(
        (subscription) => subscription.user === parsedMessage.user,
      );

      if (!subscription) return;

      subscription.socket.emit('verify', {
        user: parsedMessage.user,
        status: parsedMessage.status,
      });

      subscription.socket.disconnect();

      if (parsedMessage.status === 'success') {
        const user = await this.userRepository.findOneBy({
          id: parsedMessage.user,
        });

        for (const mode in GameModes) {
          if (!isNaN(Number(mode))) continue;

          // Add user to global leaderboard
          this.redis.zadd(`sakuru:leaderboard:${mode}`, 0, user.id);

          // Add user to country leaderboard
          this.redis.zadd(
            `sakuru:leaderboard:${mode}:${user.country}`,
            0,
            user.id,
          );
        }
      }
    });
  }

  async subscribe(user: number, socket: Socket): Promise<boolean> {
    const isExistingUser = await this.userRepository.exist({
      where: { id: user, priv: 1 },
    });

    if (
      !isExistingUser ||
      globalState.verificationQueue.includes({
        user: user,
        socket: socket,
      })
    )
      return false;

    globalState.verificationQueue.push({
      user: user,
      socket: socket,
    });

    return true;
  }
}
