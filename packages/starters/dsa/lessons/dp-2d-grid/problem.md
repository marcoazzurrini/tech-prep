# Count Reachable Cells (easy)

`grid` is a grid of `0` and `1`. A `0` is an open cell and a `1` is a wall. You start in the top-left cell. Each step goes one cell right or one cell down, and only into an open cell.

Return the number of cells you can reach. The start cell counts. If the start cell is a wall, return `0`.

Example 1: grid = [[0, 0, 0], [0, 1, 0], [0, 0, 0]]  ->  8  (every open cell)
Example 2: grid = [[0, 1, 0], [0, 0, 0], [1, 0, 0]]  ->  6  (the top-right cell is open, but you cannot move up to it)
Example 3: grid = [[1]]  ->  0

Constraints: 1 <= rows, cols <= 50, grid[r][c] is 0 or 1.
