class State {
  public static readonly preComputedScores: number[] = [];
  public static readonly memoizedScores: Record<number, number> = {};
}

export { State as appState };
