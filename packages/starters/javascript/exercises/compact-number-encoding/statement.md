# Compact Number Encoding (hard)

Write `encodeVarints(numbers)`. It packs whole numbers from 0 to 4294967295 into as few bytes as it can, and returns the bytes. Each byte is a number from 0 to 255.

Each number is split into groups of 7 bits, starting with the lowest group. Each group goes into one byte. The top bit of a byte is 1 when more bytes of the same number follow, and 0 on its last byte. The numbers follow each other in order.

Example 1: Array.from(encodeVarints([1]))  ->  [1]
Example 2: Array.from(encodeVarints([300]))  ->  [172, 2]
Example 3: Array.from(encodeVarints([127, 128]))  ->  [127, 128, 1]

Note: 300 is 0b100101100. Its low 7 bits are 0b0101100, which is 44, and 44 + 128 is 172. The rest is 0b10, which is 2.
