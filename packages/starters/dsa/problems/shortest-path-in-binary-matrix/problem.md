# Shortest Path in Binary Matrix (medium)

`grid` is an `n x n` grid. A cell with `0` is open. A cell with `1` is blocked.

Find the shortest path from the top-left cell to the bottom-right cell. The path may only use open cells. One step moves to any of the 8 cells around the current cell, diagonals included.

Return the number of cells on the shortest path. The first and last cells count. Return `-1` if there is no path.

Example 1: grid = [[0, 1], [1, 0]]  ->  2
Example 2: grid = [[0, 0, 0], [1, 1, 0], [1, 1, 0]]  ->  4
Example 3: grid = [[1, 0, 0], [1, 1, 0], [1, 1, 0]]  ->  -1  (the first cell is blocked)

Constraints: 1 <= n <= 100.
