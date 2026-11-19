import { Heap } from "./ds.ts";

export function shortestWalk(
  n: number,
  paths: number[][],
  start: number,
  goal: number
): number {
  const graph: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [a, b, minutes] of paths) {
    graph[a].push([b, minutes]);
    graph[b].push([a, minutes]);
  }

  const done = new Set<number>();
  // [minutes from start, room]
  const heap = new Heap<[number, number]>((a, b) => a[0] - b[0]);
  heap.push([0, start]);
  while (heap.size > 0) {
    // The closest room that is not final yet.
    const top = heap.pop();
    if (top === undefined) break;
    const [minutes, room] = top;
    if (room === goal) return minutes;
    if (done.has(room)) continue;
    done.add(room);
    for (const [next, w] of graph[room]) {
      if (!done.has(next)) heap.push([minutes + w, next]);
    }
  }
  return -1;
}
