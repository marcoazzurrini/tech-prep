# Smooth Sequences (easy)

Return every list of exactly `length` numbers that follows two rules. Each number is between `1` and `maxValue`. Two numbers next to each other differ by at most `1`. Return the lists in any order.

Example 1: length = 2, maxValue = 3  ->  [[1, 1], [1, 2], [2, 1], [2, 2], [2, 3], [3, 2], [3, 3]]
Example 2: length = 1, maxValue = 3  ->  [[1], [2], [3]]
Example 3: length = 3, maxValue = 1  ->  [[1, 1, 1]]

Constraints: 1 <= length <= 5, 1 <= maxValue <= 5.
