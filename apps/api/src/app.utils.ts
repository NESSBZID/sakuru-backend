import { appState } from './app.state';

export function getLevel(score: number): number {
  let left = 1;
  let right = appState.preComputedScores.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (appState.preComputedScores[mid] <= score) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left - 1;
}

export function getLevelPrecise(score: number): number {
  if (score > 10000000000000000) return 0;

  const baseLevel = getLevel(score);
  const baseLevelScore = appState.preComputedScores[baseLevel];

  if (appState.memoizedScores[baseLevel] === undefined) {
    appState.memoizedScores[baseLevel] =
      appState.preComputedScores[baseLevel + 1] - baseLevelScore;
  }

  const scoreLevelDifference = appState.memoizedScores[baseLevel];
  const scoreProgress = score - baseLevelScore;
  const res = scoreProgress / scoreLevelDifference + baseLevel;

  if (!isFinite(res)) return 0;

  return res;
}
