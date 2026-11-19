# Counting Overlaps

Some tasks ask how many intervals are open at the same time. Process the intervals in order of start. Keep the end times of the open ones in a min-heap. Before you add an interval, remove every end that has passed.

## Worked example

Guests visit a shop. For each guest, count the guests inside just after they enter.

```ts
import { Heap } from "./ds.ts";

const visits = [
  [1, 5],
  [2, 3],
  [4, 8],
  [6, 7],
]; // sorted by start
const ends = new Heap<number>(); // end times of the guests inside
const inside: number[] = [];

for (const [start, end] of visits) {
  while (ends.size > 0 && ends.peek()! <= start) {
    ends.pop(); // this guest has left
  }
  ends.push(end);
  inside.push(ends.size);
}
// inside: [1, 2, 2, 2]
```

## Why it works

- Starts come in order. So an end that has passed now has passed for every later start too.
- The min-heap gives the earliest end first. If that guest is still inside, all the others are too.
- `ends.size` is the number of open intervals right now.

## When to use it

- The task asks for the number of rooms, servers or seats needed, or the "maximum at the same time".
- A resource has a fixed limit, and you must know how much is in use when something starts.
- Merging is not enough: you need to know how many intervals overlap, not only whether they do.
