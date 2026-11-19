# Two Heaps

To follow the middle of a growing set of numbers, split it into two halves. A max-heap holds the lower half, so its top is the largest small number. A min-heap holds the upper half, so its top is the smallest large number. Keep the sizes balanced. Then the middle is on top of the heaps.

## Worked example

Add four numbers one at a time, and look at the two tops.

```ts
import { Heap } from "./ds.ts";

const low = new Heap<number>((a, b) => b - a); // max-heap: lower half
const high = new Heap<number>(); // min-heap: upper half

for (const n of [5, 1, 8, 3]) {
  low.push(n);
  high.push(low.pop()!); // the largest low number moves up
  if (high.size > low.size) low.push(high.pop()!); // rebalance
}

// low holds 1 and 3, with 3 on top. high holds 5 and 8, with 5 on top.
```

## Why it works

- Each new number goes into `low` first. Then the top of `low` moves to `high`. So every number in `low` stays at or below every number in `high`.
- The size check moves one number back when `high` is larger. So the sizes differ by at most one.
- The middle values are the two tops. You read them in O(1), and each new number costs O(log n).

## When to use it

- The task asks for the median, or the middle value, of numbers that keep arriving.
- You need the answer after every new number. Sorting each time is too slow.
- You split items into a small half and a large half, and only the border matters.
