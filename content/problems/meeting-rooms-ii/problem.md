# Meeting Rooms II (medium)

Given a list of meeting times `intervals`, each `[start, end]`, return the minimum number of conference rooms needed to hold all of them. A room freed at time `t` can be reused by a meeting that starts at `t`.

Example 1: intervals = [[0, 30], [5, 10], [15, 20]]  ->  2
Example 2: intervals = [[7, 10], [2, 4]]  ->  1
Example 3: intervals = [[1, 5], [2, 6], [3, 7], [5, 8]]  ->  3 (at time 3 three meetings run at once)

Constraints: 0 <= len(intervals) <= 10^4, 0 <= start < end <= 10^6.
