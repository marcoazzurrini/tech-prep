export function largestElsewhere(nums: number[]): number[] {
  const n = nums.length;
  const answer: number[] = new Array(n).fill(0);
  // Left pass: answer[i] is the largest value before i.
  let before = -Infinity;
  for (let i = 0; i < n; i++) {
    answer[i] = before;
    before = Math.max(before, nums[i]);
  }
  // Right pass: combine it with the largest value after i.
  let after = -Infinity;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] = Math.max(answer[i], after);
    after = Math.max(after, nums[i]);
  }
  return answer;
}
