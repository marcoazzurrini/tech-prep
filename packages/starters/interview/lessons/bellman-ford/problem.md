# Cheapest With Tickets (easy)

A bus network has `n` stops, numbered 0 to `n - 1`. Each entry of `rides` is `[from, to, price]`: a one-way ride from stop `from` to stop `to`. You start at stop 0, and you may take at most `tickets` rides.

Return a list with one number per stop: the lowest total price to get to that stop. Use -1 for a stop you cannot get to.

Example 1: n = 3, rides = [[0, 1, 2], [1, 2, 2], [0, 2, 9]], tickets = 1  ->  [0, 2, 9]
Example 2: n = 3, rides = [[0, 1, 2], [1, 2, 2], [0, 2, 9]], tickets = 2  ->  [0, 2, 4]  (two rides reach stop 2 for 4)
Example 3: n = 3, rides = [[0, 1, 5]], tickets = 0  ->  [0, -1, -1]

Constraints: 1 <= n <= 100, 0 <= len(rides) <= 1000, 0 <= tickets <= 100, 1 <= price <= 1000.
