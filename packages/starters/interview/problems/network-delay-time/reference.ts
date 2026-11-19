import { Heap } from "./ds.ts";

export function networkDelayTime(times: number[][], n: number, k: number): number {
  const graph = new Map<number, [number, number][]>();
  for (const [src, dst, time] of times) {
    const out = graph.get(src) ?? [];
    out.push([dst, time]);
    graph.set(src, out);
  }

  const dist = new Map<number, number>(); // node -> final arrival time
  // [arrival time, node]
  const heap = new Heap<[number, number]>((a, b) => a[0] - b[0]);
  heap.push([0, k]);
  while (heap.size > 0) {
    // The closest node that is not final yet.
    const top = heap.pop();
    if (top === undefined) break;
    const [time, node] = top;
    if (dist.has(node)) continue;
    dist.set(node, time);
    for (const [next, w] of graph.get(node) ?? []) {
      if (!dist.has(next)) heap.push([time + w, next]);
    }
  }

  // The last node to receive the signal sets the answer.
  return dist.size === n ? Math.max(...dist.values()) : -1;
}
