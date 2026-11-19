# Binary Tree Maximum Path Sum (hard)

A path in a binary tree is a sequence of nodes where each consecutive pair is joined by an edge, and no node appears twice. It does not have to pass through the root, and it contains at least one node. Given the `root`, return the largest possible sum of the values along any path.

Example 1: root = [1, 2, 3]  ->  6  (2 -> 1 -> 3)
Example 2: root = [-10, 9, 20, null, null, 15, 7]  ->  42  (15 -> 20 -> 7)
Example 3: root = [-3]  ->  -3

Trees are shown in level order, with `null` for a missing child.
Constraints: 1 <= number of nodes <= 3 * 10^4, -1000 <= Node.val <= 1000.
