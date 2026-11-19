# Walk Every Street (easy)

A town has corners with numbers. Each entry of `streets` is `[from, to]`: a one-way street from corner `from` to corner `to`.

Start at corner `start` and walk every street exactly once. Return the corners in the order you visit them. The first corner is `start`. Every test has exactly one such walk.

Example 1: streets = [[0, 1], [1, 3], [1, 2], [2, 1]], start = 0  ->  [0, 1, 2, 1, 3]  (corner 3 is a dead end, so it comes last)
Example 2: streets = [[2, 5]], start = 2  ->  [2, 5]
Example 3: streets = [], start = 4  ->  [4]

Constraints: 0 <= len(streets) <= 500, 0 <= from, to <= 1000.
