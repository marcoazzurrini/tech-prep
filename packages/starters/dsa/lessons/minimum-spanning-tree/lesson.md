# Minimum Spanning Tree

A spanning tree joins every node of a graph and has no cycle. The minimum one has the lowest total edge weight. Grow one tree: again and again, add the cheapest edge that reaches a node not in the tree yet.

## Worked example

Find the lowest cost to join four towns by road.

```ts
import { Heap } from "./ds.ts";

// roads[a] lists [b, cost] for each road that touches town a.
const roads = [
  [
    [1, 4],
    [2, 1],
  ],
  [
    [0, 4],
    [2, 2],
    [3, 5],
  ],
  [
    [0, 1],
    [1, 2],
  ],
  [[1, 5]],
];
const inTree = new Set<number>();
const heap = new Heap<number[]>((a, b) => a[0] - b[0]);
heap.push([0, 0]); // [cost, town]: town 0 starts the tree for free
let total = 0;
while (inTree.size < roads.length) {
  const [cost, town] = heap.pop()!;
  if (inTree.has(town)) continue; // this road reaches nothing new
  inTree.add(town);
  total += cost;
  for (const [next, w] of roads[town]) heap.push([w, next]);
}
// total: 8, from the roads that cost 1, 2 and 5
```

## Why it works

- The heap holds every edge that leaves the tree. The cheapest of them is always safe to take: some edge must cross to the outside, and no other one is cheaper.
- The `inTree` check skips an edge whose far end is in the tree. That edge would close a cycle.
- The heap entry is the cost of **one edge**. Dijkstra stores the total from the start instead. That is the only difference.

## When to use it

- The task asks for the cheapest way to connect everything.
- Only the total weight of the chosen edges counts, not the path between two nodes.
- The edges have no direction.
