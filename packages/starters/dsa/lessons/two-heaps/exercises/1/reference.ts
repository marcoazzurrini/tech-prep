import { Heap } from "./ds.ts";

export function middleGap(nums: number[]): number {
  const low = new Heap<number>((a, b) => b - a); // max-heap: the lower half
  const high = new Heap<number>(); // min-heap: the upper half
  for (const num of nums) {
    // Go through `low`, so the largest low number moves up to `high`.
    low.push(num);
    high.push(low.pop()!);
    // Keep the sizes balanced.
    if (high.size > low.size) low.push(high.pop()!);
  }
  return high.peek()! - low.peek()!;
}
