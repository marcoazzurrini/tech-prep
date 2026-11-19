# Min Cost to Connect All Points (medium)

Each entry of `points` is a point `[x, y]` on a grid. Joining two points costs their Manhattan distance: `|x1 - x2| + |y1 - y2|`. Join points until every point can be reached from every other point. Return the smallest total cost.

Example 1: points = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]  ->  20
Example 2: points = [[3, 12], [-2, 5], [-4, 1]]  ->  18
Example 3: points = [[0, 0]]  ->  0  (one point needs no joins)

Constraints: 1 <= len(points) <= 1000, -10^6 <= x, y <= 10^6, all points are different.
