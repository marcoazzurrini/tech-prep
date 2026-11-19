# Codes Without Repeats (easy)

Given a list `digits` of distinct digits and a number `length`, return every code of exactly `length` digits. A code is a list of digits. It may use each digit of `digits` at most once. The order matters: `[1, 2]` and `[2, 1]` are different codes. Return the codes in any order.

Example 1: digits = [1, 2, 3], length = 2  ->  [[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]]
Example 2: digits = [5], length = 1  ->  [[5]]
Example 3: digits = [4, 7], length = 2  ->  [[4, 7], [7, 4]]

Constraints: 1 <= length <= len(digits) <= 6, 0 <= digits[i] <= 9, all digits are distinct.
