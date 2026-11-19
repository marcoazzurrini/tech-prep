export function findTargetSumWays(nums: number[], target: number): number {
  // If the plus group sums to p, then p - (total - p) = target, so p = (total + target) / 2.
  const total = nums.reduce((sum, num) => sum + num, 0);
  if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0;
  const goal = (total + target) / 2;
  // ways[s] = number of subsets that sum to s.
  const ways = new Array<number>(goal + 1).fill(0);
  ways[0] = 1;
  for (const num of nums) {
    // Going downwards uses each number at most once.
    for (let s = goal; s >= num; s--) {
      ways[s]! += ways[s - num]!;
    }
  }
  return ways[goal]!;
}
