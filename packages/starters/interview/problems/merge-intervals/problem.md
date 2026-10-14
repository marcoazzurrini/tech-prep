# Merge Intervals (medium)

Given a list of `intervals`, each `[start, end]`, in no particular order, merge every group of overlapping intervals into one. Intervals that only touch (one ends where the next starts) also merge. Return the merged intervals sorted by start.

Example 1: intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]  ->  [[1, 6], [8, 10], [15, 18]]
Example 2: intervals = [[1, 4], [4, 5]]  ->  [[1, 5]] (they touch at 4)
Example 3: intervals = [[4, 7], [1, 4], [0, 0]]  ->  [[0, 0], [1, 7]]

Constraints: 1 <= len(intervals) <= 10^4, 0 <= start <= end <= 10^4.
