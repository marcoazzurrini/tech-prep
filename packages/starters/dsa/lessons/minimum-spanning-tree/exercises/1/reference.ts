import { Heap } from "./ds.ts";

export function cheapestPipeNetwork(n: number, pipes: number[][]): number {
  const graph: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [a, b, cost] of pipes) {
    graph[a].push([cost, b]);
    graph[b].push([cost, a]);
  }

  const inTree = new Set<number>();
  // [pipe cost, house]: house 0 starts the tree for free
  const heap = new Heap<[number, number]>((a, b) => a[0] - b[0]);
  heap.push([0, 0]);
  let total = 0;
  while (inTree.size < n) {
    // The cheapest pipe that leaves the tree.
    const top = heap.pop();
    if (top === undefined) break;
    const [cost, house] = top;
    if (inTree.has(house)) continue;
    inTree.add(house);
    total += cost;
    for (const edge of graph[house]) heap.push(edge);
  }
  return total;
}
