# Cheapest Flights Within K Stops (medium)

There are `n` cities, numbered 0 to `n - 1`. Each entry of `flights` is `[from, to, price]`: a one-way flight from city `from` to city `to`.

Return the lowest total price of a trip from city `src` to city `dst` with at most `k` stops. A stop is a city where you change planes, so a trip with `k` stops uses `k + 1` flights. Return -1 if no such trip exists.

Example 1: n = 4, flights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], src = 0, dst = 3, k = 1
  ->  700  (0 -> 1 -> 3; the cheaper trip 0 -> 1 -> 2 -> 3 has two stops)
Example 2: n = 3, flights = [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src = 0, dst = 2, k = 1  ->  200
Example 3: n = 3, flights = [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src = 0, dst = 2, k = 0  ->  500

Constraints: 1 <= n <= 100, 1 <= price <= 10^4, 0 <= k < n, `src` and `dst` are different, at most one flight from one city to another.
