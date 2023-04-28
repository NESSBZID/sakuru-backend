import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { VerificationService } from './verification.service';

@WebSocketGateway(3727, {
  cors: {
    origin: /^(https|http)?:\/\/(localhost|sakuru\.cc|dev\.lol)(:\d{1,5})?$/i,
  },
})
export class VerificationGateway {
  constructor(private readonly verificationService: VerificationService) {}

  @SubscribeMessage('verify')
  async listenForMessages(
    @MessageBody('user') user: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (!user) return;

    if (await this.verificationService.subscribe(user, client)) {
      client.emit('verify', {
        user: user,
        status: 'pending',
      });
    } else {
      client.emit('verify', {
        user: user,
        status: 'failed',
      });
    }
  }
}
