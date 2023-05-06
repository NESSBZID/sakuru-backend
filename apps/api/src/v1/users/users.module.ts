import { Module } from '@nestjs/common';
import { UsersServiceV1 } from './users.service';
import { UsersControllerV1 } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatEntity, UserEntity } from '@shared/entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomClientTCP } from '@shared/tcp-client/customClient';

@Module({
  imports: [
    ClientsModule.register([
      {
        customClass: CustomClientTCP,
        name: 'GRAPHS_SERVICE',
        options: {
          transport: Transport.TCP,
          port: 8876,
          host: 'localhost',
        },
      },
    ]),
    TypeOrmModule.forFeature([UserEntity, StatEntity]),
  ],
  providers: [UsersServiceV1],
  controllers: [UsersControllerV1],
})
export class UsersModuleV1 {}
