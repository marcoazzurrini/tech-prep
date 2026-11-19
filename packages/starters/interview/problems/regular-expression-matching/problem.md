# Regular Expression Matching (hard)

Return `true` if the pattern `p` matches the **whole** string `s`. The pattern has two special characters:
- `.` matches any one character.
- `*` means "zero or more of the character before it". So `a*` matches `""`, `"a"`, `"aa"` and so on, and `.*` matches any string.

Every other character matches only itself.

Example 1: s = "aa", p = "a"  ->  false  (the pattern covers only one `a`)
Example 2: s = "aa", p = "a*"  ->  true
Example 3: s = "ab", p = ".*"  ->  true
Example 4: s = "aab", p = "c*a*b"  ->  true  (`c*` matches nothing)

Constraints: 0 <= len(s) <= 20, 0 <= len(p) <= 20. `s` has lowercase English letters. `p` has lowercase English letters, `.` and `*`. Every `*` has a character before it that is not `*`.
