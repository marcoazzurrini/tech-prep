# Merge K Sorted Lists (hard)

You get an array `lists` of `k` linked lists, each sorted in ascending order. Merge them all into a single sorted linked list and return its head.

Example 1: lists = [[1, 4, 5], [1, 3, 4], [2, 6]]  ->  [1, 1, 2, 3, 4, 4, 5, 6]
Example 2: lists = []  ->  []
Example 3: lists = [[]]  ->  []

Constraints: 0 <= k <= 10^4, 0 <= length of each list <= 500, -10^4 <= Node.val <= 10^4, total nodes <= 10^4.
Follow-up: merging the lists one at a time costs O(k * N). Can you get O(N log k)?
