export function bestRibbonPrice(prices: number[], length: number): number {
  // best[n] = most money for a ribbon of length n.
  const best = new Array<number>(length + 1).fill(0);
  for (let n = 1; n <= length; n++) {
    // Try every size for the last piece. The rest may reuse any size.
    for (let piece = 1; piece <= Math.min(n, prices.length); piece++) {
      best[n] = Math.max(best[n], prices[piece - 1] + best[n - piece]);
    }
  }
  return best[length];
}
