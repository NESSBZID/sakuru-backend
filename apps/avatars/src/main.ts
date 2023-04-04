import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AvatarsModule } from './avatars.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AvatarsModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8878,
      },
    },
  );

  await app.listen();
}

bootstrap();
