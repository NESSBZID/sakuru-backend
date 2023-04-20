import { ClientTCP } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export class CustomClientTCP extends ClientTCP {
  public receive<TResult = any>(pattern: unknown): Observable<TResult> {
    return this.send(pattern, {});
  }
}
