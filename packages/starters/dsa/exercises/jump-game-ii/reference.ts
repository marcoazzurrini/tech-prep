export function jump(nums: number[]): number {
  let jumps = 0;
  let end = 0; // farthest index the jumps so far can reach
  let farthest = 0; // farthest index one more jump can reach
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    // Past `end` you need one more jump. Take it as far as possible.
    if (i === end) {
      jumps++;
      end = farthest;
    }
  }
  return jumps;
}
