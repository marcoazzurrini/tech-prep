# Pow(x, n) (medium)

Return `x` raised to the power `n`. The exponent `n` is an integer and can be negative. Do not use a built-in power function.

Example 1: x = 2, n = 10  ->  1024
Example 2: x = 2, n = -2  ->  0.25  (1 / 2^2)
Example 3: x = 0.5, n = 3  ->  0.125
Example 4: x = 5, n = 0  ->  1

Constraints: -100 < x < 100, -2^31 <= n <= 2^31 - 1. `x` is not 0 when `n` is negative. The result is between -10^4 and 10^4.
Note: the tests only use values whose result is exact as a floating-point number.
