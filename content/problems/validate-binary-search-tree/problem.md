# Validate Binary Search Tree (medium)

Given the `root` of a binary tree, return `true` if it is a valid binary search tree: for every node, all values in its left subtree are strictly smaller than the node's value and all values in its right subtree are strictly larger.

Example 1: root = [2, 1, 3]  ->  true
Example 2: root = [5, 1, 4, null, null, 3, 6]  ->  false  (4 sits in the right subtree of 5 but is smaller)
Example 3: root = [5, 4, 6, null, null, 3, 7]  ->  false  (3 is under 5's right subtree, even though 3 < 6 is fine locally)

Trees are shown in level order, with `null` for a missing child.
Constraints: 1 <= number of nodes <= 10^4, -2^31 <= Node.val <= 2^31 - 1.
