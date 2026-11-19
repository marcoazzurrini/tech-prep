# Sorting and Merging Intervals

Intervals in random order are hard to compare. Sort them by start. Then walk through them once and keep the end of the current merged block. An interval overlaps that block exactly when it starts before the block ends.

## Worked example

Staff shifts may overlap. Count the hours with at least one person at work.

```ts
const shifts = [
  [9, 12],
  [1, 4],
  [3, 6],
];
shifts.sort((a, b) => a[0] - b[0]); // [1,4], [3,6], [9,12]

let covered = 0;
let end = -Infinity; // end of the current merged block
for (const [start, stop] of shifts) {
  if (start < end) {
    covered += Math.max(0, stop - end); // overlap: add only the new part
  } else {
    covered += stop - start; // a new block starts
  }
  end = Math.max(end, stop);
}
// covered: 8. Hours 1 to 6, then hours 9 to 12.
```

## Why it works

- After the sort, every later interval starts at or after this one. So only the block's end matters.
- `start < end` is the whole overlap test. One comparison per interval.
- `Math.max(end, stop)` keeps the furthest end. A short interval inside a long one must not pull the end back.

## When to use it

- The input is a list of ranges: `[start, end]` pairs, meetings, bookings.
- The task says "overlap", "merge", "conflict", "cover" or "gap".
- Read the task for intervals that only touch. If they count as overlapping, use `<=`.
