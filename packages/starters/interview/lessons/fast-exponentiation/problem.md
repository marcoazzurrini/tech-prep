# Power with Remainder (easy)

Return the remainder of `base` to the power `exponent`, divided by `mod`.

The exponent can be one billion. A loop with one multiplication per step is too slow. The full power is also far too large to store. So take the remainder after every multiplication: this keeps the numbers small and does not change the answer.

Example 1: base = 2, exponent = 10, mod = 1000 -> 24 (2^10 is 1024) Example 2: base = 3, exponent = 0, mod = 7 -> 1 Example 3: base = 7, exponent = 222, mod = 10 -> 9 (the last digit of 7^222)

Constraints: 1 <= base <= 10^6, 0 <= exponent <= 10^9, 1 <= mod <= 10^6.
