# Read an Image Header (medium)

Write `readHeader(bytes)`. `bytes` is an array of 8 numbers from 0 to 255: the start of an image file. Every number in it is stored little-endian, with its low byte first.

- Bytes 0 and 1 hold the width, a whole number from 0 to 65535.
- Bytes 2 and 3 hold the height, in the same way.
- Bytes 4 to 7 hold `x`, a whole number that can be negative, from -2147483648 to 2147483647.

Return `{ width, height, x }`.

Example 1: readHeader([128, 2, 224, 1, 255, 255, 255, 255])  ->  { width: 640, height: 480, x: -1 }
Example 2: readHeader([1, 0, 1, 0, 0, 0, 0, 0])  ->  { width: 1, height: 1, x: 0 }
