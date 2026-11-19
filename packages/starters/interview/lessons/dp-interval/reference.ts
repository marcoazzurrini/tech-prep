export function minMergeCost(piles: number[]): number {
  const n = piles.length;
  // cost[i][j] = cheapest way to merge piles i..j into one pile.
  const cost = piles.map(() => new Array<number>(n).fill(0));
  for (let width = 1; width < n; width++) {
    for (let i = 0; i + width < n; i++) {
      const j = i + width;
      // The last merge joins the piles i..k and k+1..j. Try every k.
      let best = Infinity;
      let stones = piles[j]!;
      for (let k = i; k < j; k++) {
        best = Math.min(best, cost[i]![k]! + cost[k + 1]![j]!);
        stones += piles[k]!;
      }
      // The last merge costs all the stones of the range.
      cost[i]![j] = best + stones;
    }
  }
  return cost[0]![n - 1]!;
}
