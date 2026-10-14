# Minimum Window Substring (hard)

Given strings `s` and `t`, return the shortest contiguous substring of `s` that contains every character of `t`, counting duplicates (if `t` has two `a`s, the window needs at least two `a`s). If no such substring exists, return the empty string `""`. The tests always have a single shortest window.

Example 1: s = "ADOBECODEBANC", t = "ABC"  ->  "BANC"
Example 2: s = "a", t = "a"  ->  "a"
Example 3: s = "a", t = "aa"  ->  "" (s has only one 'a')

Constraints: 1 <= len(s), len(t) <= 10^5, uppercase and lowercase English letters (case matters).
Follow-up: can you do it in O(len(s) + len(t)) time?
