export function largestWindowMinimum(nums: number[], k: number): number {
  const queue: number[] = []; // indices; their values increase from front to back
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    // A larger, older value can never be the minimum again.
    while (queue.length > 0 && nums[queue[queue.length - 1]] >= nums[i])
      queue.pop();
    queue.push(i);
    if (queue[0] <= i - k) queue.shift(); // the front index has left the window
    if (i >= k - 1) best = Math.max(best, nums[queue[0]]); // the front is the minimum
  }
  return best;
}
