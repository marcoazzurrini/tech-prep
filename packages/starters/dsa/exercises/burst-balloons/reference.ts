export function maxCoins(nums: number[]): number {
  const vals = [1, ...nums, 1];
  const n = vals.length;
  // best[i][j] = most coins from bursting every balloon strictly between i and j.
  const best = vals.map(() => new Array<number>(n).fill(0));
  for (let width = 2; width < n; width++) {
    for (let i = 0; i + width < n; i++) {
      const j = i + width;
      // k is the balloon burst last in the range. Its neighbours are then i and j.
      for (let k = i + 1; k < j; k++) {
        const coins = best[i]![k]! + vals[i]! * vals[k]! * vals[j]! + best[k]![j]!;
        best[i]![j] = Math.max(best[i]![j]!, coins);
      }
    }
  }
  return best[0]![n - 1]!;
}
