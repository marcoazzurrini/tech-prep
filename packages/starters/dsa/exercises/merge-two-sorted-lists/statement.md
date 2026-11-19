# Merge Two Sorted Lists (easy)

You get the heads of two linked lists, `list1` and `list2`, each sorted in non-decreasing order. Splice their nodes together into one sorted list and return its head.

Example 1: list1 = [1, 2, 4], list2 = [1, 3, 4]  ->  [1, 1, 2, 3, 4, 4]
Example 2: list1 = [], list2 = []  ->  []
Example 3: list1 = [], list2 = [0]  ->  [0]

Constraints: 0 <= nodes in each list <= 50, -100 <= Node.val <= 100, both lists are sorted.
Follow-up: can you reuse the existing nodes instead of creating new ones?
