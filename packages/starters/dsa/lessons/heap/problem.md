# Smallest Pile after Doubling (easy)

You have piles of coins. `piles[i]` is the number of coins in pile `i`. Do this `k` times: take the smallest pile and double it. Then return the size of the smallest pile.

Example 1: piles = [1, 2, 3], k = 1 -> 2 (1 becomes 2; the piles are 2, 2, 3) Example 2: piles = [1, 8], k = 3 -> 8 (1 becomes 2, then 4, then 8) Example 3: piles = [4, 9], k = 0 -> 4

Constraints: 1 <= len(piles) <= 1000, 1 <= piles[i] <= 1000, 0 <= k <= 20.
