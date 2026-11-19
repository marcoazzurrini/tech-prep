import { Heap } from "./ds.ts";

export function kClosest(points: number[][], k: number): number[][] {
  const dist = (p: number[]) => p[0] * p[0] + p[1] * p[1];
  // Max-heap of the k closest points so far: the farthest of them is on top.
  const heap = new Heap<number[]>((a, b) => dist(b) - dist(a));
  for (const point of points) {
    heap.push(point);
    // More than k points: drop the farthest one.
    if (heap.size > k) heap.pop();
  }
  const closest: number[][] = [];
  while (heap.size > 0) closest.push(heap.pop()!);
  return closest;
}
