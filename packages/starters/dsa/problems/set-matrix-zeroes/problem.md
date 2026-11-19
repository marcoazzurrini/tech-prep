# Set Matrix Zeroes (medium)

Given an `m x n` integer matrix, whenever a cell holds 0, set its entire row and its entire column to 0. Do it in place: modify `matrix` directly. The function returns nothing; the matrix itself is checked.

Example 1: matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]  ->  [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
Example 2: matrix = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]  ->  [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]

Constraints: 1 <= m, n <= 200, -2^31 <= matrix[i][j] <= 2^31 - 1.
Follow-up: O(m + n) extra space is easy; can you use O(1)?
