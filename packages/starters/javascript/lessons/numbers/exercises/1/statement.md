`sameAmount(a, b)` should return `true` when two amounts are equal, or differ only by a tiny rounding error.

The code below compares with `===`, so `0.1 + 0.2` and `0.3` count as different. Fix it.

Example 1: sameAmount(0.1 + 0.2, 0.3)  ->  true
Example 2: sameAmount(0.3, 0.31)  ->  false

Note: Every amount is below 1.
