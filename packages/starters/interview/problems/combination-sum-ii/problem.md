# Combination Sum II (medium)

Given a list of positive integers `candidates` and a positive `target`, return every distinct combination of candidates that adds up to `target`. Each item of the list may be used at most once in a combination. The list may contain equal numbers. Two combinations are the same if they hold the same numbers the same number of times. Return the combinations, and the numbers inside each one, in any order.

Example 1: candidates = [10, 1, 2, 7, 6, 1, 5], target = 8  ->  [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]
Example 2: candidates = [2, 5, 2, 1, 2], target = 5  ->  [[1, 2, 2], [5]]
Example 3: candidates = [1], target = 2  ->  []

Constraints: 1 <= len(candidates) <= 30, 1 <= candidates[i] <= 50, 1 <= target <= 30.
