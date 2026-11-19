# Longest Even Path (easy)

Given the `root` of a binary tree, find the longest path that uses only nodes with even values. Return the number of nodes on it. Return `0` if no value is even.

A path follows parent-child links and uses each node once. It may go up to one top node and down the other side. It does not have to pass through the root.

Example 1: root = [2, 4, 6] -> 3 (4 -> 2 -> 6) Example 2: root = [1, 2, 4] -> 1 (the odd root separates 2 and 4) Example 3: root = [1, 2, null, 4, 6] -> 3 (4 -> 2 -> 6, below the root) Example 4: root = [] -> 0

Trees are shown in level order, with `null` for a missing child. Constraints: 0 <= number of nodes <= 1000, 0 <= Node.val <= 100.
