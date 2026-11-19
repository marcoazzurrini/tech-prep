# Cheapest Pipe Network (easy)

A village has `n` houses, numbered 0 to `n - 1`. Each entry of `pipes` is `[a, b, cost]`: a water pipe that can be built between house `a` and house `b` for `cost`. Water flows both ways.

Build pipes so that water can get from house 0 to every house. Return the lowest total cost. The pipes on offer can always connect every house.

Example 1: n = 4, pipes = [[0, 1, 1], [1, 2, 2], [2, 3, 3], [0, 3, 4], [0, 2, 5]]  ->  6  (build the pipes that cost 1, 2 and 3)
Example 2: n = 2, pipes = [[0, 1, 7]]  ->  7
Example 3: n = 1, pipes = []  ->  0

Constraints: 1 <= n <= 100, 0 <= len(pipes) <= 1000, 0 <= cost <= 1000.
