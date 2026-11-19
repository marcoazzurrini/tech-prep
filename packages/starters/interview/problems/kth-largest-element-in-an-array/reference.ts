import { Heap } from "./ds.ts";

export function findKthLargest(nums: number[], k: number): number {
  // Min-heap holding the k largest values seen so far.
  const heap = new Heap<number>();
  for (const num of nums) {
    heap.push(num);
    // More than k values: the smallest cannot be the answer.
    if (heap.size > k) heap.pop();
  }
  // The smallest of the k largest is the kth largest.
  return heap.peek()!;
}
