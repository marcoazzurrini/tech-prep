# Linked List Cycle (easy)

Given the `head` of a linked list, return `true` if following `next` pointers ever brings you back to a node you already visited (the list has a cycle), and `false` if the list ends.

In the examples, a list is written as `[values], pos`: the last node points back to the node at index `pos`, or nowhere when `pos = -1`. Your function only receives `head`.

Example 1: [3, 2, 0, -4], pos = 1  ->  true  (the tail links back to the node with value 2)
Example 2: [1, 2], pos = 0  ->  true
Example 3: [1], pos = -1  ->  false

Constraints: 0 <= number of nodes <= 10^4, -10^5 <= Node.val <= 10^5.
Follow-up: can you do it with O(1) extra memory?
