import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { StatisticsModule } from './statistics.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StatisticsModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'statistics',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'statistics-consumer',
        },
      },
    },
  );

  await app.listen();
}

bootstrap();
