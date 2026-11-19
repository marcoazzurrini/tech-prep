# Jump Forever (easy)

A board has `n` squares, labelled `0` to `n - 1`. Each pair `[from, to]` in `jumps` is a one-way jump from one square to another. A player starts on square `start` and may take any jump that leaves the current square.

Return `true` if the player can keep jumping forever. That is possible only when the player can get onto a cycle. Return `false` if every route from `start` comes to an end.

Example 1: n = 3, jumps = [[0, 1], [1, 2], [2, 0]], start = 0  ->  true
Example 2: n = 3, jumps = [[0, 1], [1, 2]], start = 0  ->  false
Example 3: n = 4, jumps = [[1, 2], [2, 1], [0, 3]], start = 0  ->  false  (the cycle cannot be reached from square 0)

Constraints: 1 <= n <= 1000, 0 <= jumps.length <= 5000, from != to, all pairs are distinct.
