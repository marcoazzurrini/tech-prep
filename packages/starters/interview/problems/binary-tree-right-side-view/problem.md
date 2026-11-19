# Binary Tree Right Side View (medium)

Picture yourself standing on the right side of a binary tree. On each level you see only the rightmost node. Given the `root`, return the values you see, from top to bottom.

Example 1: root = [1, 2, 3, null, 5, null, 4]  ->  [1, 3, 4]
Example 2: root = [1, 2, 3, 4]  ->  [1, 3, 4]  (4 is on the left side, but nothing hides it)
Example 3: root = []  ->  []

Trees are shown in level order, with `null` for a missing child.
Constraints: 0 <= number of nodes <= 100, -100 <= Node.val <= 100.
