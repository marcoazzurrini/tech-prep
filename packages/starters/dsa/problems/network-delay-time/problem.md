# Network Delay Time (medium)

A network has `n` nodes, numbered 1 to `n`. Each entry of `times` is `[from, to, time]`: a signal goes from node `from` to node `to` in `time` units. The links are one-way.

Node `k` sends a signal. Return the time it takes until every node has received it. Return -1 if some node never receives it.

Example 1: times = [[2, 1, 1], [2, 3, 1], [3, 4, 1]], n = 4, k = 2  ->  2  (node 4 is last, at time 2)
Example 2: times = [[1, 2, 1]], n = 2, k = 1  ->  1
Example 3: times = [[1, 2, 1]], n = 2, k = 2  ->  -1  (node 1 is never reached)

Constraints: 1 <= k <= n <= 100, 0 <= len(times) <= 6000, 0 <= time <= 100, at most one link from one node to another.
