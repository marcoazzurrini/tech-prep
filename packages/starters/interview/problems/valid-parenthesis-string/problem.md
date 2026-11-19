# Valid Parenthesis String (medium)

The string `s` has only the characters `(`, `)` and `*`. Each `*` can stand for `(`, for `)`, or for nothing. Return true if you can choose a meaning for every `*` so that the string is valid, false otherwise.

A string is valid when every `(` has a matching `)` after it, and every `)` has a matching `(` before it.

Example 1: s = "()"  ->  true
Example 2: s = "(*)"  ->  true  (the `*` stands for nothing)
Example 3: s = "(*))"  ->  true  (the `*` stands for `(`)
Example 4: s = "*("  ->  false  (nothing can close the last `(`)

Constraints: 1 <= len(s) <= 100.
Follow-up: can you do it in one pass with O(1) extra space?
