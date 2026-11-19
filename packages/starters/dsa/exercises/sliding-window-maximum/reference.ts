export function maxSlidingWindow(nums: number[], k: number): number[] {
  const queue: number[] = []; // indices; their values decrease from front to back
  let head = 0; // the front of the queue; moving it is O(1), shift() is not
  const result: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    // A smaller, older value can never be the maximum again.
    while (queue.length > head && nums[queue[queue.length - 1]] <= nums[i]) queue.pop();
    queue.push(i);
    // The front index has left the window.
    if (queue[head] <= i - k) head++;
    if (i >= k - 1) result.push(nums[queue[head]]); // the front is the maximum
  }
  return result;
}
