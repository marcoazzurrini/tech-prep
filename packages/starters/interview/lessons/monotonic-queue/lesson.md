# Monotonic Queue

You need the maximum of a window that moves. Keep a queue of candidates, with the largest at the front. A new item removes the smaller items at the back. Old items leave at the front.

## Worked example

Each reading is `[minute, temperature]`. For each reading, find the hottest reading of the last 5 minutes.

```ts
const readings = [
  [0, 20],
  [2, 24],
  [3, 22],
  [6, 21],
  [9, 19],
];
const queue: number[][] = []; // temperatures fall from front to back
const hottest: number[] = [];

for (const [minute, temp] of readings) {
  while (queue.length > 0 && queue[queue.length - 1][1] <= temp) queue.pop();
  queue.push([minute, temp]);
  while (queue[0][0] <= minute - 5) queue.shift();
  hottest.push(queue[0][1]);
}

// hottest: [20, 24, 24, 24, 21]
```

## Why it works

- `queue.pop()` drops a reading that is older and not hotter than the new one. It will leave the window first, so it can never be the maximum again.
- `queue.shift()` drops the front when it is too old. The front is always the oldest reading in the queue.
- Each reading is pushed once and removed at most once. So the whole scan is O(n).

## When to use it

- The task asks for the maximum or minimum of every window as it slides.
- A sum can be fixed when an item leaves. A maximum cannot, so a plain window is not enough.
- For the minimum, flip the comparison. Then the smallest item is at the front.
