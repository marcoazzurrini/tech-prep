import { Heap } from "./ds.ts";

export class KthLargest {
  private k: number;
  private heap = new Heap<number>(); // min-heap holding the k largest numbers

  constructor(k: number, nums: number[]) {
    this.k = k;
    for (const num of nums) this.add(num);
  }

  add(val: number): number {
    this.heap.push(val);
    // More than k numbers: the smallest can never be the answer again.
    if (this.heap.size > this.k) this.heap.pop();
    // The smallest of the k largest is the kth largest.
    return this.heap.peek()!;
  }
}
