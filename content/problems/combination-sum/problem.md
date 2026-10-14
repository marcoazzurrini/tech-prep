# Combination Sum (medium)

Given a list of distinct positive integers `candidates` and a positive `target`, return every combination of candidates that adds up to `target`. Each candidate may be used any number of times. Two combinations are the same if they use the same numbers the same number of times. Return the combinations, and the numbers inside each one, in any order.

Example 1: candidates = [2, 3, 6, 7], target = 7  ->  [[2, 2, 3], [7]]
Example 2: candidates = [2, 3, 5], target = 8  ->  [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
Example 3: candidates = [2], target = 1  ->  []

Constraints: 1 <= len(candidates) <= 30, 2 <= candidates[i] <= 40 (all distinct), 1 <= target <= 40.
