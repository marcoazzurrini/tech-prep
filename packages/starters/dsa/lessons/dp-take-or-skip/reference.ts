export function bestPairProducts(nums: number[]): number {
  // best[i] = largest total from the first i numbers.
  const best = new Array<number>(nums.length + 1).fill(0);
  for (let i = 2; i <= nums.length; i++) {
    const skip = best[i - 1];
    // Taking the pair uses two numbers, so build on best[i - 2].
    const take = best[i - 2] + nums[i - 2] * nums[i - 1];
    best[i] = Math.max(skip, take);
  }
  return best[nums.length];
}
