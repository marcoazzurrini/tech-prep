# Reach a Hospital (easy)

A city has `n` crossings, labelled `0` to `n - 1`. Each pair `[from, to]` in `streets` is a one-way street: you can drive from `from` to `to`, but not back. The crossings listed in `hospitals` have a hospital.

Return every crossing from which you can drive to at least one hospital. A crossing with a hospital counts. Return the labels in increasing order.

Example 1: n = 4, streets = [[0, 1], [2, 1], [1, 3]], hospitals = [1]  ->  [0, 1, 2]
(crossing 3 has no street that leaves it)
Example 2: n = 3, streets = [], hospitals = [1]  ->  [1]

Constraints: 1 <= n <= 1000, 0 <= streets.length <= 5000, 1 <= hospitals.length <= n, the hospitals are distinct.
