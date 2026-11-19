# Count Record Lows (easy)

`prices[i]` is the price on day `i`. A day is a record low if its price is lower than the price on every earlier day. The first day is always a record low. Return the number of record lows.

Example 1: prices = [5, 3, 4, 2] -> 3 (5, 3 and 2) Example 2: prices = [1, 2, 3] -> 1 Example 3: prices = [4, 4, 4] -> 1 (an equal price is not lower)

Constraints: 1 <= len(prices) <= 10^5, -10^4 <= prices[i] <= 10^4.
