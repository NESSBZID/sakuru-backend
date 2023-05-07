import { Injectable } from '@nestjs/common';
import { appState } from './app.state';

@Injectable()
export class AppService {
  onApplicationBootstrap(): void {
    for (let i = 1; i <= 100; i++) {
      if (i > 1) {
        appState.preComputedScores[i] = Math.floor(
          (5000 / 3) * (4 * Math.pow(i, 3) - 3 * Math.pow(i, 2) - i) +
            Math.floor(1.25 * Math.pow(1.8, i - 60)),
        );
      } else {
        appState.preComputedScores[i] = 1;
      }
    }

    // It is impossible for someone to get more than level 250
    for (let i = 101; i <= 250; i++) {
      appState.preComputedScores[i] = 26931190829 + 100000000000 * (i - 100);
    }
  }
}
