# Rotting Oranges (medium)

Each cell of `grid` holds one of three values:

- `0` is an empty cell.
- `1` is a fresh orange.
- `2` is a rotten orange.

Every minute, each fresh orange that touches a rotten orange becomes rotten. Oranges touch when they are next to each other horizontally or vertically.

Return the number of minutes until no fresh orange is left. Return `-1` if some orange stays fresh forever.

Example 1: grid = [[2, 1, 1], [1, 1, 0], [0, 1, 1]]  ->  4
Example 2: grid = [[2, 1, 1], [0, 1, 1], [1, 0, 1]]  ->  -1  (the bottom-left orange is never reached)
Example 3: grid = [[0, 2]]  ->  0  (there is no fresh orange at the start)

Constraints: 1 <= rows, cols <= 10.
