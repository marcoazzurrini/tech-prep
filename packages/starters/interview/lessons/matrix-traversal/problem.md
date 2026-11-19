# Half Turn (easy)

Turn `matrix` by 180 degrees, in place. After the turn, the value from the cell `(r, c)` is in the cell `(rows - 1 - r, cols - 1 - c)`. So the first row becomes the last row, read backwards.

Change `matrix` itself. Do not return anything.

Example 1: matrix = [[1, 2], [3, 4]]  ->  [[4, 3], [2, 1]]
Example 2: matrix = [[1, 2, 3]]  ->  [[3, 2, 1]]
Example 3: matrix = [[1, 2, 3], [4, 5, 6]]  ->  [[6, 5, 4], [3, 2, 1]]

Constraints: 1 <= rows, cols <= 20, -100 <= matrix[r][c] <= 100.
