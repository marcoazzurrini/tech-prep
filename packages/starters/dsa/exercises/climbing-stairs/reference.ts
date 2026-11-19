export function climbStairs(n: number): number {
  // ways(i) = ways(i - 1) + ways(i - 2); keep only the last two values.
  let prev = 1;
  let cur = 1;
  for (let i = 1; i < n; i++) {
    [prev, cur] = [cur, prev + cur];
  }
  return cur;
}
