# Floor in a BST (easy)

Given the `root` of a binary search tree and a number `target`, return the largest value in the tree that is less than or equal to `target`. Return `null` (in Python: `None`) if every value is larger than `target`.

Use the order of the tree. Do not visit every node.

Example 1: root = [5, 3, 8], target = 4 -> 3 Example 2: root = [5, 3, 8], target = 5 -> 5 Example 3: root = [5, 3, 8], target = 2 -> null

Trees are shown in level order, with `null` for a missing child. Constraints: 0 <= number of nodes <= 1000, -10^4 <= Node.val, target <= 10^4, values are unique.
