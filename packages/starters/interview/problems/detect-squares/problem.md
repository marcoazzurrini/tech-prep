# Detect Squares (medium)

Implement a class `DetectSquares` that stores points on a grid and counts squares.
- `DetectSquares()`: creates an empty store.
- `add(point)`: adds the point `[x, y]`. The same point can be added many times. Each copy counts as a separate point.
- `count(point)`: takes a query point `[x, y]`. Returns the number of ways to pick three stored points that form a square together with the query point.

Only squares with sides parallel to the x and y axes count. The square must have an area larger than 0. The query point is not added to the store.

Example:
  ops  = ["DetectSquares", "add", "add", "add", "count", "count", "add", "count"]
  args = [[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]]
  ->     [null, null, null, null, 1, 0, null, 2]
  The second `[11, 2]` is a separate point, so the last query finds two squares.

Constraints: 0 <= x, y <= 1000, at most 3000 calls in total.
