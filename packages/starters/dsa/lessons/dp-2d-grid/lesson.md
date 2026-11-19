# 2-D Grid DP

Some answers depend on two positions, a row and a column. Keep a table with one answer per cell. Fill it row by row. Each cell is built from the cell above it and the cell to its left, which are already filled.

## Worked example

Walk from the top-left cell to the bottom-right cell. Each step goes right or down. Collect as many coins as you can.

```ts
const coins = [
  [1, 3, 1],
  [2, 0, 4],
  [5, 1, 2],
];
const best = coins.map((row) => row.map(() => 0));

for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    const top = r > 0 ? best[r - 1][c] : 0;
    const left = c > 0 ? best[r][c - 1] : 0;
    best[r][c] = coins[r][c] + Math.max(top, left);
  }
}

// best[2][2] is 11: the path 1, 3, 1, 4, 2
```

## Why it works

- `best[r][c]` is the most coins you can hold when you arrive at the cell `(r, c)`.
- You can only arrive from above or from the left. So the best of those two, plus the coins of this cell, is the answer for this cell.
- The loops go top to bottom and left to right. Both neighbours are ready before you need them.

## When to use it

- The task has a grid, and moves go only right or down.
- It asks to count paths, or to find the best total along a path.
- A cell needs only the row above and its own row. One row of memory is then enough.
