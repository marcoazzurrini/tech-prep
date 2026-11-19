# Dijkstra's Shortest Paths

BFS finds shortest paths when every edge costs the same. With weighted edges, use a min-heap instead of a queue. Always expand the closest node that is not finished. The first time a node is popped, its distance is final.

## Worked example

Find the shortest travel time from town 0 to every town.

```ts
import { Heap } from "./ds.ts";

// roads[a] lists [b, minutes] for each road out of town a.
const roads = [
  [
    [1, 4],
    [2, 1],
  ],
  [[3, 1]],
  [
    [1, 2],
    [3, 5],
  ],
  [],
];
const dist = new Map<number, number>(); // town -> final time
const heap = new Heap<number[]>((a, b) => a[0] - b[0]);
heap.push([0, 0]); // [minutes, town]
while (heap.size > 0) {
  const [minutes, town] = heap.pop()!;
  if (dist.has(town)) continue; // popped before: already final
  dist.set(town, minutes);
  for (const [next, w] of roads[town]) {
    if (!dist.has(next)) heap.push([minutes + w, next]);
  }
}
// dist: town 0 -> 0, town 2 -> 1, town 1 -> 3, town 3 -> 4
```

## Why it works

- The heap gives the smallest total first. Any other way to that town goes through a larger total, so it cannot be shorter.
- A town can sit in the heap many times. The `dist.has` check keeps the first pop and skips the rest.
- Each entry holds the **total** time from the start, not the weight of one road.

## When to use it

- The task asks for the shortest, cheapest or fastest path, and the edges have different weights.
- No weight is negative.
- A "path cost" other than a sum also works, such as the largest edge on the path.
