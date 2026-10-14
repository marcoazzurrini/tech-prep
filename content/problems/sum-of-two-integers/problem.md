# Sum of Two Integers (medium)

Return the sum of the integers `a` and `b` without using the `+` or `-` operators. Both may be negative.

Example 1: a = 1, b = 2  ->  3
Example 2: a = 2, b = 3  ->  5
Example 3: a = -7, b = 4  ->  -3

Constraints: -1000 <= a, b <= 1000.
Hint: think about what XOR and AND tell you about each column of a binary addition. In Python integers are unbounded, so you will need to emulate 32-bit wraparound.
