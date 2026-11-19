# Mutual Friends (easy)

There are `n` people, labelled `0` to `n - 1`. Each pair `[x, y]` in `friendships` means `x` and `y` are friends. Friendship goes both ways.

Return every person who is a friend of both `a` and `b`. Return the labels in increasing order.

Example 1: n = 4, friendships = [[0, 1], [0, 2], [1, 2], [2, 3]], a = 0, b = 1  ->  [2]
Example 2: n = 3, friendships = [], a = 0, b = 1  ->  []
Example 3: n = 5, friendships = [[0, 2], [0, 3], [0, 4], [1, 4], [1, 2], [1, 3]], a = 0, b = 1  ->  [2, 3, 4]

Constraints: 2 <= n <= 1000, 0 <= friendships.length <= 5000, all pairs are distinct, x != y, a != b.
