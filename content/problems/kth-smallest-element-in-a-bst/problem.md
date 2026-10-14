# Kth Smallest Element in a BST (medium)

Given the `root` of a binary search tree and an integer `k`, return the `k`-th smallest value in the tree (counting from 1).

Example 1: root = [3, 1, 4, null, 2], k = 1  ->  1
Example 2: root = [5, 3, 6, 2, 4, null, null, 1], k = 3  ->  3
Example 3: root = [1], k = 1  ->  1

Trees are shown in level order, with `null` for a missing child.
Constraints: 1 <= k <= number of nodes <= 10^4, 0 <= Node.val <= 10^4.
Follow-up: if the tree changed often and you had to answer many such queries, how would you speed it up?
