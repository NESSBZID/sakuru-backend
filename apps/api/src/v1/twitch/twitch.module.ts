import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TwitchControllerV1 } from './twitch.controller';
import { TwitchServiceV1 } from './twitch.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TWITCH_SERVICE',
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
    ]),
  ],
  providers: [TwitchServiceV1],
  controllers: [TwitchControllerV1],
})
export class TwitchModuleV1 {}
