export function maxProfitWithCooldown(prices: number[]): number {
  // Three states at the end of each day: holding a share, just sold, resting.
  let hold = -Infinity;
  let sold = 0;
  let rest = 0;
  for (const price of prices) {
    // Buy only from rest. That enforces the one-day wait after a sale.
    const nextHold = Math.max(hold, rest - price);
    const nextSold = hold + price;
    rest = Math.max(rest, sold);
    hold = nextHold;
    sold = nextSold;
  }
  return Math.max(sold, rest);
}
