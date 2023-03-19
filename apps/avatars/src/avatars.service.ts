import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarsService {
  getHello(): string {
    return 'Hello World!';
  }
}
