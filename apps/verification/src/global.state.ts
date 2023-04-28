import { Subscription } from '@shared/interfaces/verificationGateway.interface';

class Global {
  public static readonly verificationQueue: Subscription[] = [];
}

export { Global as globalState };
