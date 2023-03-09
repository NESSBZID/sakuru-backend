import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const configService = app.get<ConfigService>(ConfigService);

  // API uri setup
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // CORS setup
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    methods: ['GET', 'PUT', 'POST', 'PATCH'],
    credentials: true,
    preflightContinue: false,
    allowedHeaders: 'Content-Type, Accept',
  });

  // Enable validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000);
}

bootstrap();
