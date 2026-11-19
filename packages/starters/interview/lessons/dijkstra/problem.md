# Shortest Walk (easy)

A building has `n` rooms, numbered 0 to `n - 1`. Each entry of `paths` is `[a, b, minutes]`: a hallway between room `a` and room `b` that takes `minutes` to walk. You can walk a hallway in both directions.

Return the fewest minutes it takes to walk from room `start` to room `goal`. Return -1 if you cannot get there.

Example 1: n = 4, paths = [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 5]], start = 0, goal = 3  ->  8  (0 -> 2 -> 1 -> 3)
Example 2: n = 2, paths = [], start = 0, goal = 1  ->  -1
Example 3: n = 1, paths = [], start = 0, goal = 0  ->  0

Constraints: 1 <= n <= 100, 0 <= len(paths) <= 1000, 0 <= minutes <= 100.
