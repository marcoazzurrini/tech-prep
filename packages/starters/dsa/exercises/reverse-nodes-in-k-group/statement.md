# Reverse Nodes in k-Group (hard)

You get the `head` of a linked list and a number `k`. Split the list into groups of `k` nodes, from the head. Reverse the nodes inside each group. If fewer than `k` nodes are left at the end, leave them in their order. Return the head of the changed list.

Move the nodes themselves. Do not change their values.

Example 1: head = [1, 2, 3, 4, 5], k = 2  ->  [2, 1, 4, 3, 5]
Example 2: head = [1, 2, 3, 4, 5], k = 3  ->  [3, 2, 1, 4, 5]
Example 3: head = [1, 2, 3], k = 1  ->  [1, 2, 3]

Constraints: 1 <= k <= number of nodes <= 5000, 0 <= Node.val <= 1000.
Follow-up: can you do it with O(1) extra memory?
