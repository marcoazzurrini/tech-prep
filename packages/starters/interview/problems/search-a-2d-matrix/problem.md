# Search a 2D Matrix (medium)

The grid `matrix` holds integers with two rules:
- every row is sorted from smallest to largest,
- the first value of a row is larger than the last value of the row above it.

Return `true` if `target` is in the grid, and `false` if not. Your solution must run in O(log(m * n)) time, where `m` is the number of rows and `n` is the number of columns.

Example 1: matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 3  ->  true
Example 2: matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 13  ->  false

Constraints: 1 <= m, n <= 100, -10^4 <= matrix[i][j], target <= 10^4.
