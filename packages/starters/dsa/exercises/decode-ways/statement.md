# Decode Ways (medium)

Letters are encoded as numbers: "A" -> "1", "B" -> "2", ..., "Z" -> "26". Given a string of digits `s`, return how many different ways it can be split back into letters. Each piece must be a number from 1 to 26 written without a leading zero ("06" is not valid).

Example 1: s = "12"  ->  2  ("AB" or "L")
Example 2: s = "226"  ->  3  ("BZ", "VF", "BBF")
Example 3: s = "06"  ->  0  (no letter maps to "0" or "06")

Constraints: 1 <= len(s) <= 100, s contains only digits. The answer fits in a 53-bit integer.
