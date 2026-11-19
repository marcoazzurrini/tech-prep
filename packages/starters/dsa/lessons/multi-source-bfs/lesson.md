# Multi-Source BFS

Sometimes there are many starting points, and you need the distance to the nearest one. Do not run one BFS for each source. Put every source in the queue at the start, each with distance 0. Then one BFS spreads out from all of them together.

## Worked example

A row of garden beds has two taps. Find how far each place is from its nearest tap.

```ts
const row = ["tap", "bed", "bed", "bed", "tap", "bed"];
const dist = row.map((cell) => (cell === "tap" ? 0 : -1));

const queue: number[] = [];
for (let i = 0; i < row.length; i++) if (row[i] === "tap") queue.push(i);

for (let head = 0; head < queue.length; head++) {
  const i = queue[head];
  for (const next of [i - 1, i + 1]) {
    if (next < 0 || next >= row.length || dist[next] !== -1) continue;
    dist[next] = dist[i] + 1;
    queue.push(next);
  }
}
// dist: [0, 1, 2, 1, 0, 1]
```

## Why it works

- Both taps are in the queue before the loop starts. So the search moves out from every tap, one step at a time.
- A bed gets its distance the first time it is reached. That first visit comes from its nearest tap.
- `dist` is also the visited set: `-1` means "not reached yet".

## When to use it

- The task asks for the distance to the **nearest** of several things: the nearest gate, exit or zero.
- Something spreads from many places at once, such as fire, rot or water, and the task asks how long it takes.
- One BFS from each source would be too slow.
