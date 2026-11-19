# Interleaving String (medium)

Return `true` if `s3` can be built by mixing `s1` and `s2`. Mixing means: use every character of `s1` and every character of `s2` exactly once, and keep the characters of each string in their original order.

Example 1: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"  ->  true
Example 2: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"  ->  false
Example 3: s1 = "", s2 = "", s3 = ""  ->  true

Constraints: 0 <= len(s1), len(s2) <= 100, 0 <= len(s3) <= 200, lowercase English letters.
Follow-up: use only O(len(s2)) extra memory.
