# Multiply by One Digit (easy)

`digits` holds the digits of a non-negative integer, with the most significant digit first. Multiply the integer by `factor`, which is a single digit from 1 to 9. Return the digits of the result.

The integer can be very long. Do not convert the whole list to a number.

Example 1: digits = [1, 2, 3], factor = 2 -> [2, 4, 6] Example 2: digits = [9], factor = 9 -> [8, 1] Example 3: digits = [1, 2, 5], factor = 8 -> [1, 0, 0, 0]

Constraints: 1 <= len(digits) <= 100, 0 <= digits[i] <= 9, 1 <= factor <= 9. There is no leading zero, except for the number 0 itself.
