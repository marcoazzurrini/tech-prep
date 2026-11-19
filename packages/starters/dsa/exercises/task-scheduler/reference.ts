import { Heap } from "./ds.ts";

export function leastInterval(tasks: string[], n: number): number {
  const counts = new Map<string, number>();
  for (const task of tasks) counts.set(task, (counts.get(task) ?? 0) + 1);
  // Max-heap of how many runs each kind of task still needs.
  const heap = new Heap<number>((a, b) => b - a);
  for (const count of counts.values()) heap.push(count);

  const cooling: [number, number][] = []; // [runs left, time it may run again]
  let head = 0;
  let time = 0;
  while (heap.size > 0 || head < cooling.length) {
    time++;
    if (heap.size > 0) {
      // Run the kind with the most runs left. Then it must cool down.
      const left = heap.pop()! - 1;
      if (left > 0) cooling.push([left, time + n]);
    }
    // A kind whose wait is over goes back into the heap.
    if (head < cooling.length && cooling[head][1] === time) heap.push(cooling[head++][0]);
  }
  return time;
}
