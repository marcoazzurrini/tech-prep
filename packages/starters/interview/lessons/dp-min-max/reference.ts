export function bestAddOrMultiply(nums: number[]): number {
  let high = nums[0];
  let low = nums[0];
  for (const x of nums.slice(1)) {
    // A negative x can turn the smallest value into the largest, so try both.
    const options = [high + x, high * x, low + x, low * x];
    high = Math.max(...options);
    low = Math.min(...options);
  }
  return high;
}
