# Add Two Numbers (medium)

Two linked lists, `l1` and `l2`, each hold one number that is zero or more. Each node holds one digit. The digits are in reverse order: the head holds the ones digit. Add the two numbers. Return the sum as a linked list in the same reverse order.

A number has no leading zeros, except the number 0 itself, which is the list `[0]`.

Example 1: l1 = [2, 4, 3], l2 = [5, 6, 4]  ->  [7, 0, 8]  (342 + 465 = 807)
Example 2: l1 = [0], l2 = [0]  ->  [0]
Example 3: l1 = [9, 9, 9], l2 = [1]  ->  [0, 0, 0, 1]  (999 + 1 = 1000)

Constraints: 1 <= nodes in each list <= 100, 0 <= Node.val <= 9.
