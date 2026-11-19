# Grid Search

A grid is a graph. Each cell is a node. Its neighbours are the cells above, below, left and right. Before you work on a cell, check that it is inside the grid, and mark it as visited.

## Worked example

Count the open cells you can reach from the top-left corner. `#` is a wall.

```ts
const grid = ["..#", ".##", "#.."];
const seen = new Set<string>();

function visit(r: number, c: number): number {
  if (r < 0 || r >= 3 || c < 0 || c >= 3) return 0; // off the grid
  if (grid[r][c] === "#" || seen.has(`${r},${c}`)) return 0;
  seen.add(`${r},${c}`); // mark before recursing
  return (
    1 + visit(r + 1, c) + visit(r - 1, c) + visit(r, c + 1) + visit(r, c - 1)
  );
}
const count = visit(0, 0);
// count: 3. The two open cells in the last row are cut off.
```

## Why it works

- The bounds check comes first. Reading `grid[r][c]` outside the grid would fail.
- The mark comes before the four calls. Without it, two neighbours would call each other forever.
- All checks sit at the top of the function. So the four calls need no `if` of their own.

## When to use it

- The input is a 2D grid, board or map.
- The task talks about cells that touch, a region, or a path that moves up, down, left or right.
- If one cell may be used again on another path, unmark it after the four calls. That is backtracking.
