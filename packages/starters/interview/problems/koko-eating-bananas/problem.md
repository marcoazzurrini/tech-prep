# Koko Eating Bananas (medium)

Koko has piles of bananas. Pile `i` holds `piles[i]` bananas. She has `h` hours to eat them all.

She picks one eating speed `k`, in bananas per hour. Each hour she picks one pile and eats `k` bananas from it. If the pile holds fewer than `k` bananas, she eats the whole pile and then waits for the next hour.

Return the smallest whole number `k` that lets her finish every pile within `h` hours.

Example 1: piles = [3, 6, 7, 11], h = 8  ->  4
Example 2: piles = [30, 11, 23, 4, 20], h = 5  ->  30
Example 3: piles = [30, 11, 23, 4, 20], h = 6  ->  23

Constraints: 1 <= len(piles) <= 10^4, len(piles) <= h <= 10^9, 1 <= piles[i] <= 10^9.
