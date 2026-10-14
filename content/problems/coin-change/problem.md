# Coin Change (medium)

You have coins of the denominations in `coins`, with an unlimited supply of each. Return the smallest number of coins that add up to exactly `amount`, or -1 if that amount cannot be made.

Example 1: coins = [1, 2, 5], amount = 11  ->  3  (5 + 5 + 1)
Example 2: coins = [2], amount = 3  ->  -1
Example 3: coins = [1], amount = 0  ->  0

Constraints: 1 <= len(coins) <= 12, 1 <= coins[i] <= 2^31 - 1, 0 <= amount <= 10^4.
