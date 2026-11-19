# Non-overlapping Intervals (medium)

Given a list of `intervals`, each `[start, end]`, return the smallest number of intervals you must delete so that none of the remaining ones overlap. Intervals that only touch (like `[1, 2]` and `[2, 3]`) do not overlap.

Example 1: intervals = [[1, 2], [2, 3], [3, 4], [1, 3]]  ->  1 (drop [1, 3])
Example 2: intervals = [[1, 2], [1, 2], [1, 2]]  ->  2
Example 3: intervals = [[1, 2], [2, 3]]  ->  0

Constraints: 1 <= len(intervals) <= 10^5, -5 * 10^4 <= start < end <= 5 * 10^4.
