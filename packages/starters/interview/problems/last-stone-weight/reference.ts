import { Heap } from "./ds.ts";

export function lastStoneWeight(stones: number[]): number {
  // Max-heap: the heaviest stone comes out first.
  const heap = new Heap<number>((a, b) => b - a);
  for (const stone of stones) heap.push(stone);
  while (heap.size > 1) {
    const first = heap.pop()!;
    const second = heap.pop()!;
    // What is left of the heavier stone goes back into the heap.
    if (first > second) heap.push(first - second);
  }
  return heap.peek() ?? 0;
}
