# Shortest Path by BFS

BFS visits nodes level by level: first the start, then every node one step away, then every node two steps away. So the first time BFS reaches a node, it came by a shortest path. This is only true when every step costs the same. Count the levels to get the distance.

## Worked example

Start with the number 1. One move adds 1 or doubles the number. Find the fewest moves to reach 10.

```ts
let level = [1];
const seen = new Set(level);
let moves = 0;
while (!seen.has(10)) {
  const next: number[] = [];
  for (const x of level) {
    for (const y of [x + 1, x * 2]) {
      if (seen.has(y) || y > 10) continue;
      seen.add(y);
      next.push(y);
    }
  }
  level = next;
  moves++;
}
// moves: 4  (1, 2, 4, 5, 10)
```

## Why it works

- `level` holds every number that needs exactly `moves` moves. Each pass builds the next level from it.
- `seen` keeps only the first visit of a number. The first visit is the shortest one.
- No graph is stored. The neighbours of `x` are computed: `x + 1` and `x * 2`.

## When to use it

- The task asks for the "fewest", the "minimum number of" or the "shortest": steps, moves or changes.
- Every step costs the same. When steps have different costs, plain BFS gives wrong answers.
- From any state you can list the next states: the cells around a cell, or a word with one letter changed.
