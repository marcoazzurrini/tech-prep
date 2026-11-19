# Count Echoes (easy)

You get the `head` of a linked list and a number `n`. A node is an **echo** when it has the same value as the node `n` steps before it. Return the number of echoes.

Example 1: head = [1, 2, 1, 2, 3], n = 2 -> 2 (the second 1 and the second 2) Example 2: head = [5, 5, 5], n = 1 -> 2 Example 3: head = [1, 2], n = 4 -> 0 (no node has a node 4 steps before it)

Constraints: 0 <= number of nodes <= 100, 1 <= n <= 100, 0 <= Node.val <= 1000.
