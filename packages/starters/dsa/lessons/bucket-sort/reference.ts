export function rankByWins(wins: number[]): number[] {
  // buckets[w] holds the players with w wins, in index order.
  const buckets: number[][] = [];
  for (let w = 0; w <= wins.length; w++) buckets.push([]);
  for (let player = 0; player < wins.length; player++) {
    buckets[wins[player]].push(player);
  }
  // Read the buckets from the most wins down.
  const ranked: number[] = [];
  for (let w = wins.length; w >= 0; w--) {
    ranked.push(...buckets[w]);
  }
  return ranked;
}
