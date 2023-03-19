import { Injectable } from '@nestjs/common';

@Injectable()
export class TwitchService {
  getHello(): string {
    return 'Hello World!';
  }
}
