# Lowest Common Ancestor of a Binary Search Tree (medium)

Given the `root` of a binary search tree and two of its nodes `p` and `q`, return their lowest common ancestor: the deepest node that has both `p` and `q` in its subtree. A node counts as its own descendant.

In the examples, `p` and `q` are written by their values (all values are distinct); your function receives the actual nodes.

Example 1: root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 8  ->  6
Example 2: root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 4  ->  2  (2 is an ancestor of 4)
Example 3: root = [2, 1], p = 2, q = 1  ->  2

Trees are shown in level order, with `null` for a missing child.
Constraints: 2 <= number of nodes <= 10^5, -10^9 <= Node.val <= 10^9, values are unique, p != q, both are in the tree.
Follow-up: can you use the BST ordering to avoid searching both subtrees?
