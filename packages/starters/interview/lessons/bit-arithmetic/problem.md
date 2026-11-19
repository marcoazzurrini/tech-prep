# Subtract without Minus (easy)

Given two integers with `a >= b >= 0`, return `a - b`. Do not use the `+` or `-` operators.

Example 1: a = 5, b = 3 -> 2 Example 2: a = 8, b = 1 -> 7 Example 3: a = 6, b = 0 -> 6

Constraints: 0 <= b <= a <= 10^9. Note: `a ^ b` subtracts each column without borrowing. A column needs a borrow when `a` has 0 and `b` has 1. That is `~a & b`. The borrow is taken from the next column to the left.
