# Max Area of Island (medium)

Each cell of `grid` is `1` (land) or `0` (water). An island is a group of land cells connected horizontally or vertically. The area of an island is its number of cells. Return the area of the largest island. Return `0` if there is no land.

Example 1: grid = [[0, 0, 1, 0, 0], [1, 1, 1, 0, 1], [0, 1, 0, 0, 1], [0, 0, 0, 1, 1]]  ->  5
Example 2: grid = [[0, 0, 0], [0, 0, 0]]  ->  0
Example 3: grid = [[1, 0], [0, 1]]  ->  1  (diagonal cells are not connected)

Constraints: 1 <= rows, cols <= 50.
