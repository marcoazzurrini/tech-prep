# Reach the Border (easy)

You are given a `grid` of numbers. `0` is an open cell and `1` is a wall. You start on the open cell at `row`, `col`. One move goes to the open cell above, below, left or right. Return `true` if you can reach a cell on the border of the grid, and `false` if you cannot. A border cell is in the first or last row, or in the first or last column. If the start cell is on the border, the answer is `true`.

Example 1: grid = [[1, 1, 1], [1, 0, 1], [1, 1, 1]], row = 1, col = 1  ->  false
Example 2: grid = [[1, 0, 1], [1, 0, 1], [1, 1, 1]], row = 1, col = 1  ->  true
Example 3: grid = [[0]], row = 0, col = 0  ->  true

Constraints: 1 <= rows, cols <= 50, grid[row][col] is 0.
