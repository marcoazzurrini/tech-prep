# Rolling Ball Routes (easy)

`heights` is a grid of heights. A ball starts in the top-left cell. It rolls one step at a time to the cell above, below, left or right, but only to a cell that is **lower** than its own cell. The ball stops in a cell that has no lower neighbour.

Return the number of different routes the ball can take from the start until it stops.

Example 1: heights = [[3, 2], [2, 1]]  ->  2  (right then down, or down then right)
Example 2: heights = [[1, 2], [3, 4]]  ->  1  (the ball cannot move: staying is the one route)
Example 3: heights = [[4, 3], [3, 3]]  ->  2  (it stops after one step, on the right or below)

Constraints: 1 <= rows, cols <= 30, 0 <= heights[r][c] <= 1000. The answer is at most 10^9.
