# Subtree of Another Tree (easy)

Given the roots of two binary trees, `root` and `subRoot`, return `true` if some node of `root` is the top of a subtree identical to `subRoot` (same shape and values, all the way down to the leaves). A tree counts as a subtree of itself.

Example 1: root = [3, 4, 5, 1, 2], subRoot = [4, 1, 2]  ->  true
Example 2: root = [3, 4, 5, 1, 2, null, null, null, null, 0], subRoot = [4, 1, 2]  ->  false  (the 4 in root has an extra descendant 0)
Example 3: root = [1, 1], subRoot = [1]  ->  true

Trees are shown in level order, with `null` for a missing child.
Constraints: 1 <= nodes in root <= 2000, 1 <= nodes in subRoot <= 1000, -10^4 <= Node.val <= 10^4.
