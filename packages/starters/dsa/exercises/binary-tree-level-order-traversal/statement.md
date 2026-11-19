# Binary Tree Level Order Traversal (medium)

Given the `root` of a binary tree, return its values level by level: a list per depth, top level first, each read from left to right.

Example 1: root = [3, 9, 20, null, null, 15, 7]  ->  [[3], [9, 20], [15, 7]]
Example 2: root = [1]  ->  [[1]]
Example 3: root = []  ->  []

Trees are shown in level order, with `null` for a missing child.
Constraints: 0 <= number of nodes <= 2000, -1000 <= Node.val <= 1000.
