# Longest Free Gap (easy)

A machine is busy during each of the `intervals`, each `[start, end]`, in no particular order. Busy times may overlap. A gap is a stretch of time between two busy times when the machine is free. Return the length of the longest gap. Return `0` if there is no gap. Time before the first start and after the last end does not count.

Example 1: intervals = [[1, 3], [6, 9]]  ->  3 (free from 3 to 6)
Example 2: intervals = [[1, 5], [2, 3], [8, 9]]  ->  3 (free from 5 to 8)
Example 3: intervals = [[1, 4], [4, 6]]  ->  0

Constraints: 1 <= len(intervals) <= 1000, 0 <= start < end <= 10^6.
