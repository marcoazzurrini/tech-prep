# Trailing Ones Table (easy)

The trailing ones of a number are the 1 bits at the low end of its binary form, before the first 0. For example, 11 is 1011 in binary, so it has 2 trailing ones. An even number has 0.

Given `n`, return an array `table` of length `n + 1`, where `table[i]` is the number of trailing ones of `i`.

Example 1: n = 3 -> [0, 1, 0, 2] Example 2: n = 7 -> [0, 1, 0, 2, 0, 1, 0, 3] Example 3: n = 0 -> [0]

Constraints: 0 <= n <= 10^4.
