# Split into Short Palindromes (easy)

Return `true` if you can cut the string `s` into pieces so that every piece is a palindrome of length 2 or 3. Otherwise return `false`.

A piece of length 2 is good when its two letters are equal, like `aa`. A piece of length 3 is good when its first and last letters are equal, like `aba` or `aaa`.

Example 1: s = "aabab" -> true The pieces are "aa" and "bab". Example 2: s = "abaa" -> false After "aba", the single "a" is too short. Example 3: s = "abacc" -> true

Constraints: 1 <= len(s) <= 1000, lowercase English letters.
