# Count Good Nodes in Binary Tree (medium)

Given the `root` of a binary tree, count its good nodes. A node is **good** when no node on the path from the root down to it has a larger value. The root is always good.

Example 1: root = [3, 1, 4, 3, null, 1, 5]  ->  4  (the root 3, the 4, the 5 and the lower 3)
Example 2: root = [3, 3, null, 4, 2]  ->  3  (the 2 is not good: a 3 is above it)
Example 3: root = [1]  ->  1

Trees are shown in level order, with `null` for a missing child.
Constraints: 1 <= number of nodes <= 10^5, -10^4 <= Node.val <= 10^4.
