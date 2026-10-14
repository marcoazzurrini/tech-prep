export function coinChange(coins: number[], amount: number): number {
  // best[a] = fewest coins summing to a (amount + 1 means "impossible").
  const best = new Array<number>(amount + 1).fill(amount + 1);
  best[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) best[a] = Math.min(best[a]!, best[a - c]! + 1);
    }
  }
  return best[amount]! <= amount ? best[amount]! : -1;
}
