# Best Time to Buy and Sell Stock with Cooldown (medium)

`prices[i]` is the price of a stock on day `i`. You may buy and sell as many times as you like, with two rules:
- You hold at most one share. Sell it before you buy again.
- After you sell, you must wait one day. You cannot buy on the next day.

Return the largest profit you can make. Return `0` if no trade makes a profit.

Example 1: prices = [1, 2, 3, 0, 2]  ->  3  (buy, sell, wait, buy, sell)
Example 2: prices = [1]  ->  0
Example 3: prices = [1, 4, 2, 7]  ->  6  (buy at 1, sell at 7)

Constraints: 1 <= len(prices) <= 5000, 0 <= prices[i] <= 1000.
