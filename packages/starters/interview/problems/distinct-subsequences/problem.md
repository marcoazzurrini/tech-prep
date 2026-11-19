# Distinct Subsequences (hard)

Return the number of ways to get `t` from `s` by deleting characters of `s`. The characters that stay keep their order. Two ways are different when they keep different positions of `s`.

Return `0` if `t` cannot be made.

Example 1: s = "rabbbit", t = "rabbit"  ->  3  (delete any one of the three `b`s)
Example 2: s = "babgbag", t = "bag"  ->  5
Example 3: s = "a", t = "b"  ->  0

Constraints: 1 <= len(s), len(t) <= 1000, English letters. The answer fits in a 32-bit signed integer.
