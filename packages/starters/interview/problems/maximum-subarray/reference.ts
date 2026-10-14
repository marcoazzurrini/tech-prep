export function maxSubArray(nums: number[]): number {
  // cur = best sum of a subarray ending here; restart when the running sum would only hurt.
  let best = nums[0]!;
  let cur = best;
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i]!, cur + nums[i]!);
    best = Math.max(best, cur);
  }
  return best;
}
