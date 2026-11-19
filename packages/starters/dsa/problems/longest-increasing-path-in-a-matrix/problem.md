# Longest Increasing Path in a Matrix (hard)

Given a grid of integers `matrix`, return the length of the longest path on which every value is larger than the one before it. The length is the number of cells on the path.

A path may start in any cell. Each step goes to the cell above, below, left or right. Diagonal steps are not allowed.

Example 1: matrix = [[9, 9, 4], [6, 6, 8], [2, 1, 1]]  ->  4  (1, 2, 6, 9)
Example 2: matrix = [[3, 4, 5], [3, 2, 6], [2, 2, 1]]  ->  4  (3, 4, 5, 6)
Example 3: matrix = [[1]]  ->  1

Constraints: 1 <= rows, cols <= 200, -2^31 <= matrix[i][j] <= 2^31 - 1.
