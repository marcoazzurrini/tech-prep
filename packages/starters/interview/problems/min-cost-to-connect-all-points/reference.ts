import { Heap } from "./ds.ts";

export function minCostConnectPoints(points: number[][]): number {
  const inTree = new Set<number>();
  // [cost to join, point index]: start at point 0 for free
  const heap = new Heap<[number, number]>((a, b) => a[0] - b[0]);
  heap.push([0, 0]);
  let total = 0;
  while (inTree.size < points.length) {
    // The cheapest edge that leaves the tree.
    const top = heap.pop();
    if (top === undefined) break;
    const [cost, i] = top;
    if (inTree.has(i)) continue;
    inTree.add(i);
    total += cost;
    // Offer an edge from the new point to every point outside the tree.
    for (let j = 0; j < points.length; j++) {
      if (inTree.has(j)) continue;
      const dist =
        Math.abs(points[i][0] - points[j][0]) +
        Math.abs(points[i][1] - points[j][1]);
      heap.push([dist, j]);
    }
  }
  return total;
}
