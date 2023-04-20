import { Injectable, Logger } from '@nestjs/common';
import { RedisVerificationMessage } from './v1/interfaces/verificationGateway.interface';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { globalState } from './global.state';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

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
    });
  }
}
