# Group Sizes (easy)

There are `n` computers, labelled `0` to `n - 1`. Each pair `[a, b]` in `edges` is a cable between two computers. Computers are in the same group when a chain of cables joins them. A computer with no cable is a group of size 1.

Return the size of every group, in increasing order.

Example 1: n = 5, edges = [[0, 1], [1, 2], [3, 4]]  ->  [2, 3]
Example 2: n = 3, edges = []  ->  [1, 1, 1]
Example 3: n = 4, edges = [[0, 1], [1, 2], [2, 3], [3, 0]]  ->  [4]

Constraints: 1 <= n <= 1000, 0 <= edges.length <= 5000, a != b.
