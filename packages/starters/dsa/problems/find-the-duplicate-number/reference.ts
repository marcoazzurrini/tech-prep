export function findDuplicate(nums: number[]): number {
  // Read nums as a linked list: index i points to index nums[i].
  // Two indexes point to the duplicate, so it is where a cycle begins.
  let slow = 0;
  let fast = 0;
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  // Restart one pointer at the head. They meet at the cycle start.
  let start = 0;
  while (start !== slow) {
    start = nums[start];
    slow = nums[slow];
  }
  return start;
}
