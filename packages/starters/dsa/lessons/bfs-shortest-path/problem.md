# Fewest Flights (easy)

There are `n` airports, labelled `0` to `n - 1`. Each pair `[a, b]` in `flights` is a direct flight between two airports. It can be used in both directions.

Return the fewest flights needed to travel from `start` to `target`. Return `0` if they are the same airport. Return `-1` if the trip is not possible.

Example 1: n = 4, flights = [[0, 1], [1, 2], [2, 3]], start = 0, target = 3  ->  3
Example 2: n = 4, flights = [[0, 1], [1, 2], [2, 3], [0, 3]], start = 0, target = 3  ->  1
Example 3: n = 3, flights = [[0, 1]], start = 0, target = 2  ->  -1

Constraints: 1 <= n <= 1000, 0 <= flights.length <= 5000, a != b.
