# Heaviest Pair Under the Limit (easy)

`weights` is sorted from smallest to largest. Pick two different items. Their total weight must be at most `limit`. Return the largest total you can reach, or `-1` if no pair fits.

Example 1: weights = [1, 3, 5, 8], limit = 9 -> 9 (1 + 8) Example 2: weights = [2, 5, 9, 14, 20], limit = 18 -> 16 (2 + 14) Example 3: weights = [2, 4, 6], limit = 5 -> -1

Constraints: 1 <= len(weights) <= 1000, 1 <= weights[i] <= 10^4, 1 <= limit <= 10^5.
