# K Closest Points to Origin (medium)

Each item of `points` is a point `[x, y]` on a plane. Return the `k` points closest to the origin `(0, 0)`, in any order. The distance of a point is `sqrt(x * x + y * y)`.

You never need the square root: comparing `x * x + y * y` gives the same order. The tests have one valid set of points.

Example 1: points = [[1, 3], [-2, 2]], k = 1  ->  [[-2, 2]]  (squared distances 10 and 8)
Example 2: points = [[3, 3], [5, -1], [-2, 4]], k = 2  ->  [[3, 3], [-2, 4]]

Constraints: 1 <= k <= len(points) <= 10^4, -10^4 <= x, y <= 10^4.
Follow-up: can you do it in O(n log k) with a heap that never holds more than `k` points?
