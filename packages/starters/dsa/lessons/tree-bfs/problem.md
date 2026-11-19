# Widest Level (easy)

Given the `root` of a binary tree, return the number of nodes on its fullest level. A level is all the nodes at the same depth. Only real nodes count; missing children do not. An empty tree gives `0`.

Example 1: root = [1, 2, 3] -> 2 (the level with 2 and 3) Example 2: root = [1, 2, 3, 4, null, null, 5] -> 2 (two levels have 2 nodes) Example 3: root = [1] -> 1 Example 4: root = [] -> 0

Trees are shown in level order, with `null` for a missing child. Constraints: 0 <= number of nodes <= 1000, -100 <= Node.val <= 100.
