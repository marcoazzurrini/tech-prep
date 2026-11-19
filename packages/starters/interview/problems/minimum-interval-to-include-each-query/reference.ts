import { Heap } from "./ds.ts";

export function minInterval(intervals: number[][], queries: number[]): number[] {
  const sorted = [...intervals].sort((a, b) => a[0]! - b[0]!);
  const order = queries.map((_, index) => index).sort((a, b) => queries[a]! - queries[b]!);
  const answer: number[] = new Array(queries.length).fill(-1);
  // [size, right] of intervals that have started. The smallest size comes out first.
  const heap = new Heap<[number, number]>((a, b) => a[0] - b[0]);
  let i = 0;
  // Answer the queries from smallest to largest.
  for (const index of order) {
    const q = queries[index]!;
    // Add every interval that starts at or before q.
    while (i < sorted.length && sorted[i]![0]! <= q) {
      const [left, right] = sorted[i]! as [number, number];
      heap.push([right - left + 1, right]);
      i++;
    }
    // Drop intervals that ended before q. They cannot hold a later query either.
    while (heap.size > 0 && heap.peek()![1] < q) heap.pop();
    if (heap.size > 0) answer[index] = heap.peek()![0];
  }
  return answer;
}
