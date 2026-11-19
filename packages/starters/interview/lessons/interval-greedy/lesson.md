# Greedy by End Time

Some tasks ask you to choose among intervals that clash. Sort them by end. Handle the interval that ends first, then skip every interval that clashes with that choice. The earliest end leaves the most room for the rest.

## Worked example

Each guard works one shift. An alarm test reaches the guards on shift at that moment. Find the fewest test times that reach every guard.

```ts
const shifts = [
  [1, 6],
  [2, 4],
  [5, 9],
  [7, 8],
];
shifts.sort((a, b) => a[1] - b[1]); // [2,4], [1,6], [7,8], [5,9]

const tests: number[] = [];
let last = -Infinity; // time of the latest test
for (const [start, end] of shifts) {
  if (start <= last) continue; // this guard heard the latest test
  last = end; // test at the end of the shift that ends first
  tests.push(last);
}
// tests: [4, 8]. Two tests reach all four guards.
```

## Why it works

- The shift that ends first sets a limit. A test must come at or before that end.
- Testing at that end is the best choice. It reaches the first guard and as many later shifts as possible.
- One variable is enough. After the sort, only the latest choice can clash with the next interval.

## When to use it

- The task asks for the "maximum number" of intervals that do not overlap, or the "minimum number" to remove.
- You choose which intervals to keep. You do not merge them.
- Sorting by start fails here: a long interval that starts early blocks many short ones.
