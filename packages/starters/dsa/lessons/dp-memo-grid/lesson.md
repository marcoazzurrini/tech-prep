# Memoised Search on a Grid

A depth-first search can reach the same cell by many routes. The answer for a cell is the same every time. Store it when you first compute it, and return the stored value after that. Every cell is then solved once.

## Worked example

In each cell, a number says how far you jump: right or down by that many cells. Count the ways to land on the bottom-right cell.

```ts
const jump = [
  [1, 2, 1],
  [1, 1, 1],
  [2, 1, 0],
];
const memo = jump.map((row) => row.map(() => -1));

// ways to reach the bottom-right cell from (r, c)
function ways(r: number, c: number): number {
  if (r > 2 || c > 2) return 0;
  if (r === 2 && c === 2) return 1;
  if (memo[r][c] === -1) {
    const step = jump[r][c];
    memo[r][c] = ways(r + step, c) + ways(r, c + step);
  }
  return memo[r][c];
}

// ways(0, 0) is 4
```

## Why it works

- `memo[r][c]` starts at `-1`, which means "not solved yet". No real answer is negative.
- The answer depends only on the cell, not on the route that led to it. So it is safe to reuse.
- Every jump moves right or down, so the search never comes back to a cell it is still solving.

## When to use it

- The moves depend on the values in the cells, so no simple fill order exists.
- The moves can never form a loop, for example because each step goes to a larger value.
- The task asks for the longest path, or for a count of paths, over every start cell.
