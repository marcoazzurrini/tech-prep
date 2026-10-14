export function maxProduct(nums: number[]): number {
  // Track both the largest and smallest product ending here: a negative number swaps them.
  let best = nums[0]!;
  let hi = best;
  let lo = best;
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i]!;
    [hi, lo] = [Math.max(x, hi * x, lo * x), Math.min(x, hi * x, lo * x)];
    best = Math.max(best, hi);
  }
  return best;
}
