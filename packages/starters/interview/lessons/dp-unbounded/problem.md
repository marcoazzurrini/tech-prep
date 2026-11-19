# Best Ribbon Price (easy)

You have a ribbon of `length` units. You may cut it into pieces of whole lengths. A piece of length `k` sells for `prices[k - 1]`. Pieces longer than `len(prices)` cannot be sold. You may sell many pieces of the same length.

Return the most money you can get for the whole ribbon.

Example 1: prices = [1, 5, 8, 9], length = 4 -> 10 Cut two pieces of length 2. Example 2: prices = [3, 5], length = 3 -> 9 Cut three pieces of length 1. Example 3: prices = [2], length = 0 -> 0

Constraints: 1 <= len(prices) <= 50, 1 <= prices[i] <= 1000, 0 <= length <= 200.
