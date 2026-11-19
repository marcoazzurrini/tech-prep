# Copy List with Random Pointer (medium)

Each node of a linked list has a value, a `next` pointer, and a `random` pointer. The `random` pointer leads to any node in the list, or to nothing.

Build a deep copy of the list. The copy has the same number of nodes, with the same values. Every `next` and `random` pointer in the copy leads to a node of the copy, never to a node of the original list. Return the head of the copy.

In the examples, each node is written as `[value, index of its random node]`. The index is `null` when the random pointer leads to nothing.

Example 1: head = [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]
           ->  [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]
Example 2: head = [[1, 1], [2, 1]]  ->  [[1, 1], [2, 1]]
Example 3: head = []  ->  []

Constraints: 0 <= number of nodes <= 1000, -10^4 <= node value <= 10^4.
