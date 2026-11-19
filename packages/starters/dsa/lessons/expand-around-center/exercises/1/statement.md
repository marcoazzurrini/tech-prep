# Palindrome Length at Every Centre (easy)

A string `s` of length n has 2n - 1 centres: each letter, and each gap between two letters. Number them from left to right: letter 0, the gap after letter 0, letter 1, the gap after letter 1, and so on.

Return an array with one number per centre: the length of the longest palindrome around that centre. A gap between two different letters gives `0`.

Example 1: s = "aba" -> [1, 0, 3, 0, 1] Example 2: s = "aa" -> [1, 2, 1] Example 3: s = "" -> []

Constraints: 0 <= len(s) <= 500, lowercase English letters.
