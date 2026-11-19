# Swim in Rising Water (hard)

`grid` is a square grid with `n` rows and `n` columns. `grid[r][c]` is the height of the cell in row `r`, column `c`. Rain falls, and at time `t` the water is `t` deep everywhere.

You start in the top-left cell. You can swim from a cell to the cell above, below, left or right of it, but only when both cells have a height of at most `t`. Swimming takes no time. Return the smallest time `t` at which you can reach the bottom-right cell.

Example 1: grid = [[0, 2], [1, 3]]  ->  3  (the last cell has height 3, so you wait until time 3)
Example 2: grid = [[0, 1, 2], [5, 4, 3], [6, 7, 8]]  ->  8
Example 3: grid = [[0, 9, 1], [2, 9, 3], [4, 5, 6]]  ->  6  (go down the left side and along the bottom)

Constraints: 1 <= n <= 50, 0 <= grid[r][c] <= 10^4.
