import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AvatarsModule } from './avatars.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AvatarsModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'avatars',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'avatars-consumer',
        },
      },
    },
  );

  await app.listen();
}

bootstrap();
