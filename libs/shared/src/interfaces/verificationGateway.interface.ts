import { Socket } from 'socket.io';

export interface RedisVerificationMessage {
  status: 'penidng' | 'success' | 'failed';
  user: number;
}

export interface Subscription {
  user: number;
  socket: Socket;
}
