# Sum of Digits (easy)

Given a number `n` that is not negative, return the sum of its digits.

Solve it with recursion. The last digit is `n % 10`. The other digits are the smaller number `Math.floor(n / 10)` (in Python: `n // 10`).

Example 1: n = 123 -> 6 (1 + 2 + 3) Example 2: n = 7 -> 7 Example 3: n = 0 -> 0

Constraints: 0 <= n <= 10^9.
