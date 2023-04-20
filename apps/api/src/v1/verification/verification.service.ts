import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class VerificationServiceV1 {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async subscribe() {
    this.redis.subscribe('verification', (message) => {
      console.log(message);
    });
  }
}
