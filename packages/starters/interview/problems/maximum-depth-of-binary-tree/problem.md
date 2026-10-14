# Maximum Depth of Binary Tree (easy)

Given the `root` of a binary tree, return its depth: the number of nodes on the longest path from the root down to a leaf. An empty tree has depth 0.

Example 1: root = [3, 9, 20, null, null, 15, 7]  ->  3  (3 -> 20 -> 15)
Example 2: root = [1, null, 2]  ->  2
Example 3: root = []  ->  0

Trees are shown in level order, with `null` for a missing child.
Constraints: 0 <= number of nodes <= 10^4, -100 <= Node.val <= 100.
