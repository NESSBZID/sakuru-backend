import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TwitchModule } from './twitch.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TwitchModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'twitch',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'twitch-consumer',
        },
      },
    },
  );

  await app.listen();
}

bootstrap();
