# Graph Valid Tree (medium)

You are given `n` nodes labelled `0` to `n - 1` and a list of undirected `edges`. Return `true` if these edges form a valid tree: every node is connected and there are no cycles.

Example 1: n = 5, edges = [[0, 1], [0, 2], [0, 3], [1, 4]]  ->  true
Example 2: n = 5, edges = [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]  ->  false  (1-2-3 forms a cycle)
Example 3: n = 4, edges = [[0, 1], [2, 3]]  ->  false  (not connected)

Constraints: 1 <= n <= 2000, 0 <= len(edges) <= 5000, no self-loops or repeated edges.
