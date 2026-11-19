export function missingNumber(nums: number[]): number {
  // XOR every index and value with n: matching pairs cancel, leaving the gap.
  let result = nums.length;
  nums.forEach((x, i) => {
    result ^= i ^ x;
  });
  return result;
}
