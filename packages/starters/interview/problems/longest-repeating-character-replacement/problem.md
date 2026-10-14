# Longest Repeating Character Replacement (medium)

Given an uppercase string `s` and an integer `k`, you may change at most `k` characters to any other uppercase letter. Return the length of the longest substring that can be made of one repeated letter.

Example 1: s = "ABAB", k = 2  ->  4   (change both A's or both B's)
Example 2: s = "AABABBA", k = 1  ->  4   (change the middle A: "AABBBBA")

Constraints: 1 <= len(s) <= 10^5, 0 <= k <= len(s).
