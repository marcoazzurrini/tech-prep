export function canJump(nums: number[]): boolean {
  let reach = 0; // furthest index reachable so far
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]!);
  }
  return true;
}
