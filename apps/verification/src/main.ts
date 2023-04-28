import { NestFactory } from '@nestjs/core';
import { VerificationModule } from './verification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    VerificationModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8879,
      },
    },
  );

  await app.listen();
}

bootstrap();
