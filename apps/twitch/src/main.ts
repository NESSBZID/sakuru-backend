import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TwitchModule } from './twitch.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TwitchModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8877,
      },
    },
  );

  await app.listen();
}

bootstrap();
