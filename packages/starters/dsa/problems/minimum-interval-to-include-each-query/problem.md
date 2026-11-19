# Minimum Interval to Include Each Query (hard)

You are given a list of `intervals`, each `[left, right]`, and a list of numbers `queries`. An interval contains a query `q` when `left <= q <= right`. The size of an interval is `right - left + 1`.

For each query, find the size of the smallest interval that contains it. If no interval contains it, the answer is `-1`. Return the answers in the order of `queries`.

Example 1: intervals = [[1, 4], [2, 4], [3, 6], [4, 4]], queries = [2, 3, 4, 5]  ->  [3, 3, 1, 4]
Example 2: intervals = [[2, 3], [2, 5], [1, 8], [20, 25]], queries = [2, 19, 5, 22]  ->  [2, -1, 4, 6]

Constraints: 1 <= len(intervals), len(queries) <= 10^5, 1 <= left <= right <= 10^7, 1 <= queries[i] <= 10^7.
