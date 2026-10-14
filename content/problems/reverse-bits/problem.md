# Reverse Bits (easy)

Given an unsigned 32-bit integer `n`, reverse the order of its 32 bits (bit 0 swaps with bit 31, bit 1 with bit 30, and so on) and return the result as an unsigned 32-bit integer.

Example 1: n = 43261596  ->  964176192 (00000010100101000001111010011100 becomes 00111001011110000010100101000000)
Example 2: n = 1  ->  2147483648 (the lowest bit moves to the top)
Example 3: n = 4294967293  ->  3221225471

Constraints: 0 <= n <= 2^32 - 1.
Follow-up: if this were called many times, how could you speed it up?
