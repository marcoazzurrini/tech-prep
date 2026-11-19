# Longest Run Within Budget (easy)

`costs[i]` is the cost of day `i`. Every cost is positive. Find the longest run of days in a row whose total cost is at most `budget`. Return its length, or `0` if no day fits.

Example 1: costs = [2, 1, 3, 4], budget = 5 -> 2 (2 + 1, or 1 + 3) Example 2: costs = [4, 2, 1, 1, 3], budget = 4 -> 3 (2 + 1 + 1) Example 3: costs = [5], budget = 4 -> 0

Constraints: 1 <= len(costs) <= 10^5, 1 <= costs[i] <= 10^4, 1 <= budget <= 10^9.
