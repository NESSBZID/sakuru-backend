import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { StatisticsModule } from './statistics.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StatisticsModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8876,
      },
    },
  );

  await app.listen();
}

bootstrap();
