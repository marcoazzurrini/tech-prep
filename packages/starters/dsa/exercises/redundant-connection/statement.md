# Redundant Connection (medium)

A graph has `n` nodes, labelled `1` to `n`. It started as a tree: connected, with no cycle. Then one extra edge was added. `edges` lists all `n` edges, and each `[a, b]` joins nodes `a` and `b` in both directions.

Return an edge that can be removed so that the graph is a tree again. If several edges work, return the one that comes last in `edges`.

Example 1: edges = [[1, 2], [1, 3], [2, 3]]  ->  [2, 3]
Example 2: edges = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]  ->  [1, 4]

Constraints: 3 <= n <= 1000, edges.length == n, no edge is repeated, a != b.
