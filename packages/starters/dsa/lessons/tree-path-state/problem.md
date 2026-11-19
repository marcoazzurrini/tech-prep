# Nodes Equal to the Sum Above (easy)

Given the `root` of a binary tree, count the nodes whose value equals the sum of all values above them. The values above a node are the values of its ancestors: every node on the path from the root down to its parent.

The root has no ancestors, so the sum above it is 0.

Example 1: root = [1, 1, 1] -> 2 (each child has 1 above it) Example 2: root = [3, 3, 2, 6, 1] -> 2 (the left 3 has 3 above it; the 6 has 3 + 3 above it) Example 3: root = [0] -> 1 (the root counts only when it is 0) Example 4: root = [] -> 0

Trees are shown in level order, with `null` for a missing child. Constraints: 0 <= number of nodes <= 1000, -100 <= Node.val <= 100.
