export function change(amount: number, coins: number[]): number {
  // ways[a] = number of combinations that add up to a, using the coins seen so far.
  const ways = new Array<number>(amount + 1).fill(0);
  ways[0] = 1;
  // Coins in the outer loop: each combination is counted once, not once per order.
  for (const coin of coins) {
    // Going upwards lets the same coin be used again.
    for (let a = coin; a <= amount; a++) {
      ways[a]! += ways[a - coin]!;
    }
  }
  return ways[amount]!;
}
