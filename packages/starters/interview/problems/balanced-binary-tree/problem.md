# Balanced Binary Tree (easy)

Given the `root` of a binary tree, return `true` if the tree is height-balanced. A tree is height-balanced when, at **every** node, the heights of the left and right subtrees differ by at most 1.

Example 1: root = [3, 9, 20, null, null, 15, 7]  ->  true
Example 2: root = [1, 2, 2, 3, 3, null, null, 4, 4]  ->  false  (at the root, the left side is 2 levels taller)
Example 3: root = []  ->  true

Trees are shown in level order, with `null` for a missing child.
Constraints: 0 <= number of nodes <= 5000, -10^4 <= Node.val <= 10^4.
Follow-up: can you compute each height only once?
