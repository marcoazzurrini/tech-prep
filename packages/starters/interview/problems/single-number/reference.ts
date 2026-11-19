export function singleNumber(nums: number[]): number {
  let result = 0;
  for (const num of nums) {
    // x ^ x = 0, so each pair cancels. x ^ 0 = x, so the lone value stays.
    result ^= num;
  }
  return result;
}
