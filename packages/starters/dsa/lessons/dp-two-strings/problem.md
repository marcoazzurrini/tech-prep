# Best Common Letter Score (easy)

Each letter has a score: `a` is 1, `b` is 2, and so on up to `z`, which is 26.

Pick letters that appear in both `a` and `b`, in the same order in both words. The letters do not have to be next to each other. Return the largest total score you can pick. Return `0` if the words share no letter.

Example 1: a = "abc", b = "abc" -> 6 (pick a, b, c: 1 + 2 + 3) Example 2: a = "za", b = "az" -> 26 (pick z or a, not both: their order differs) Example 3: a = "abc", b = "def" -> 0

Constraints: 0 <= len(a), len(b) <= 200, lowercase English letters.
