# Happy Number (easy)

Take a positive integer `n`. Replace it with the sum of the squares of its digits. Repeat this step.

If the number reaches `1`, `n` is a happy number. If the numbers repeat in a loop that never reaches `1`, it is not. Return `true` if `n` is happy.

Example 1: n = 19  ->  true  (19, 82, 68, 100, 1)
Example 2: n = 2  ->  false  (2, 4, 16, 37, 58, 89, 145, 42, 20, 4, and 4 was seen before)
Example 3: n = 1  ->  true

Constraints: 1 <= n <= 2^31 - 1.
