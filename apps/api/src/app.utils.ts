export function toFixedNoRound(number: number, fixed = undefined): number {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
  return Number(number.toString().match(re)[0]);
}

export function getLevel(preComputedScores: number[], score: number): number {
  let left = 1;
  let right = preComputedScores.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (preComputedScores[mid] <= score) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left - 1;
}

export function getLevelPrecise(
  preComputedScores: number[],
  memoizedScores: Record<number, number>,
  score: number,
): number {
  if (score > 10000000000000000) return 0;

  const baseLevel = getLevel(preComputedScores, score);
  const baseLevelScore = preComputedScores[baseLevel];

  if (memoizedScores[baseLevel] === undefined) {
    memoizedScores[baseLevel] =
      preComputedScores[baseLevel + 1] - baseLevelScore;
  }

  const scoreLevelDifference = memoizedScores[baseLevel];
  const scoreProgress = score - baseLevelScore;
  const res = scoreProgress / scoreLevelDifference + baseLevel;

  if (!isFinite(res)) return 0;

  return res;
}
