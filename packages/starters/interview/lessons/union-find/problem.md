# Same Group Queries (easy)

There are `n` people, labelled `0` to `n - 1`. Each pair `[a, b]` in `links` joins the group of `a` with the group of `b`. At the start every person is alone in a group.

After all the links, answer each query. A query `[x, y]` asks: are `x` and `y` in the same group? Return one boolean for each query, in the same order.

Example 1: n = 4, links = [[0, 1], [2, 3]], queries = [[0, 1], [1, 2], [3, 2]]  ->  [true, false, true]
Example 2: n = 3, links = [], queries = [[0, 1], [2, 2]]  ->  [false, true]

Constraints: 1 <= n <= 1000, 0 <= links.length <= 5000, 0 <= queries.length <= 5000.
