import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { VerificationServiceV1 } from './verification.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly verificationService: VerificationServiceV1) {}

  @SubscribeMessage('subscribe')
  listenForMessages(@MessageBody() _user: string) {
    return;
  }
}
