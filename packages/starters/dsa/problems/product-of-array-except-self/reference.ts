export function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const answer: number[] = new Array(n).fill(1);
  // First pass: answer[i] = product of everything left of i.
  for (let i = 1; i < n; i++) answer[i] = answer[i - 1] * nums[i - 1];
  // Second pass: multiply in the product of everything right of i.
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= right;
    right *= nums[i];
  }
  return answer;
}
