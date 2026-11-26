# Elapsed Milliseconds (medium)

A clock gives timestamps in nanoseconds, written as strings of digits, such as `"1700000000000000100"`. They are too large for a number to hold exactly.

Write `elapsedMs(start, end)`. It returns the whole milliseconds from `start` to `end`, as a number. A millisecond is 1,000,000 nanoseconds. Drop any part of a millisecond.

Example 1: elapsedMs("1700000000000000000", "1700000000002500000")  ->  2
Example 2: elapsedMs("1700000000000000100", "1700000000001000090")  ->  0
Example 3: elapsedMs("5", "5")  ->  0
