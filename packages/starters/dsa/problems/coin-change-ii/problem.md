# Coin Change II (medium)

You have coins of the values in `coins`. You can use each value as many times as you like. Return the number of different combinations of coins that add up to `amount`.

The order of the coins does not matter: `1 + 2` and `2 + 1` are the same combination. Return `0` if no combination works.

Example 1: amount = 5, coins = [1, 2, 5]  ->  4  (5, 2+2+1, 2+1+1+1, 1+1+1+1+1)
Example 2: amount = 3, coins = [2]  ->  0
Example 3: amount = 0, coins = [7]  ->  1  (use no coins)

Constraints: 0 <= amount <= 5000, 1 <= len(coins) <= 300, 1 <= coins[i] <= 5000, all coin values are different. The answer fits in a 32-bit signed integer.
