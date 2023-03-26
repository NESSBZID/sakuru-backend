import { Module } from '@nestjs/common';
import { StatisticsServiceV1 } from './statistics.service';
import { StatisticsControllerV1 } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapEntity, UserEntity } from '@shared/entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomClientTCP } from '@shared/tcp-client/customClient';

@Module({
  imports: [
    ClientsModule.register([
      {
        customClass: CustomClientTCP,
        name: 'STATISTICS_SERVICE',
        options: {
          transport: Transport.TCP,
          port: 8876,
          host: 'localhost',
        },
      },
    ]),
    TypeOrmModule.forFeature([UserEntity, MapEntity]),
  ],
  providers: [StatisticsServiceV1],
  controllers: [StatisticsControllerV1],
})
export class StatisticsModuleV1 {}
