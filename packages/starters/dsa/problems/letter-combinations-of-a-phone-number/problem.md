# Letter Combinations of a Phone Number (medium)

On a phone keypad, each digit from `2` to `9` stands for some letters:

- `2`: abc, `3`: def, `4`: ghi, `5`: jkl
- `6`: mno, `7`: pqrs, `8`: tuv, `9`: wxyz

Given a string `digits`, return every string you can spell by picking one letter for each digit, in the order of the digits. Return the strings in any order. If `digits` is empty, return an empty list.

Example 1: digits = "23"  ->  ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
Example 2: digits = ""  ->  []
Example 3: digits = "2"  ->  ["a", "b", "c"]

Constraints: 0 <= len(digits) <= 4, every character is a digit from 2 to 9.
