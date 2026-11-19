import { Heap } from "./ds.ts";

export function carsTurnedAway(visits: number[][], spaces: number): number {
  const sorted = [...visits].sort((a, b) => a[0]! - b[0]!);
  const leaves = new Heap<number>(); // leave times of the parked cars
  let turnedAway = 0;
  for (const visit of sorted) {
    // Free the spaces of cars that have left.
    while (leaves.size > 0 && leaves.peek()! <= visit[0]!) leaves.pop();
    if (leaves.size < spaces) {
      leaves.push(visit[1]!);
    } else {
      turnedAway++;
    }
  }
  return turnedAway;
}
