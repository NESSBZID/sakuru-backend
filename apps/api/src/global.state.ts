import { Subscription } from './v1/interfaces/verificationGateway.interface';

class Global {
  public static readonly verificationQueue: Subscription[] = [];
}

export { Global as globalState };
