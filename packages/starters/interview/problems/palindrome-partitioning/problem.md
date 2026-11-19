# Palindrome Partitioning (medium)

Given a string `s`, cut it into pieces so that every piece is a palindrome. A palindrome reads the same forwards and backwards. The pieces, joined in order, must give `s` again. Return every way to do this. Each way is the list of pieces from left to right. Return the ways in any order.

Example 1: s = "aab"  ->  [["a", "a", "b"], ["aa", "b"]]
Example 2: s = "a"  ->  [["a"]]
Example 3: s = "aba"  ->  [["a", "b", "a"], ["aba"]]

Constraints: 1 <= len(s) <= 16, lowercase English letters.
