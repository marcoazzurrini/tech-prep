import { Heap } from "./ds.ts";

export function smallestAfterDoubling(piles: number[], k: number): number {
  // A min-heap keeps the smallest pile on top.
  const heap = new Heap<number>();
  for (const pile of piles) heap.push(pile);
  for (let i = 0; i < k; i++) {
    // Take the smallest pile out, double it, and put it back.
    heap.push(2 * heap.pop()!);
  }
  return heap.peek()!;
}
