# Steps Before the Cycle (easy)

You get the `head` of a linked list. If the list has a cycle, return the number of nodes that come before the cycle. If the list ends, return `-1`. Use O(1) extra memory.

In the examples, a list is written as `[values], pos`. The last node points back to the node at index `pos`. When `pos = -1`, the list ends. Your function only receives `head`.

Example 1: [3, 2, 0, -4], pos = 1 -> 1 (only the node 3 is before the cycle) Example 2: [1, 2], pos = 0 -> 0 (the cycle begins at the head) Example 3: [1], pos = -1 -> -1

Constraints: 0 <= number of nodes <= 1000, -1000 <= Node.val <= 1000. Values may repeat, so compare nodes, not values.
