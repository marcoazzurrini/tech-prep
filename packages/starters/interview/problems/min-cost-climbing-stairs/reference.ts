export function minCostClimbingStairs(cost: number[]): number {
  // prev = cheapest way to stand on the stair one below, before = two below.
  let before = 0;
  let prev = 0;
  for (let i = 2; i <= cost.length; i++) {
    // Arrive from one stair below or from two stairs below, and pay for that stair.
    const here = Math.min(prev + cost[i - 1], before + cost[i - 2]);
    before = prev;
    prev = here;
  }
  return prev;
}
