# Reorder List (medium)

Given the `head` of a list `L0 -> L1 -> ... -> Ln-1 -> Ln`, rearrange it in place into `L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...`, alternating between the front and the back. Move the nodes themselves (don't just swap values). Return nothing; the list is checked after your call.

Example 1: head = [1, 2, 3, 4]  ->  [1, 4, 2, 3]
Example 2: head = [1, 2, 3, 4, 5]  ->  [1, 5, 2, 4, 3]
Example 3: head = [1]  ->  [1]

Constraints: 1 <= number of nodes <= 5 * 10^4, 1 <= Node.val <= 1000.
Follow-up: can you do it in O(n) time and O(1) extra memory?
