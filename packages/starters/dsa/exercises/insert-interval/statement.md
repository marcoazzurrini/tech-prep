# Insert Interval (medium)

You get a list of non-overlapping `intervals`, each `[start, end]`, sorted by start, and one more interval `newInterval`. Insert `newInterval` so the list stays sorted and non-overlapping, merging it with every interval it overlaps (intervals that share an endpoint count as overlapping). Return the resulting list.

Example 1: intervals = [[1, 3], [6, 9]], newInterval = [2, 5]  ->  [[1, 5], [6, 9]]
Example 2: intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval = [4, 8]  ->  [[1, 2], [3, 10], [12, 16]] ([4, 8] swallows [3, 5], [6, 7] and [8, 10])
Example 3: intervals = [], newInterval = [5, 7]  ->  [[5, 7]]

Constraints: 0 <= len(intervals) <= 10^4, 0 <= start <= end <= 10^5.
Follow-up: can you do it in a single O(n) pass, without re-sorting?
