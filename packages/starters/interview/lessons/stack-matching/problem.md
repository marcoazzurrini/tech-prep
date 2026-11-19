# Bracket Pairs (easy)

The string `s` holds letters and round brackets. The brackets are valid: every `(` has a matching `)` after it. Return one pair `[open, close]` for each pair of brackets. `open` is the index of the `(` and `close` is the index of its matching `)`. List the pairs in the order in which the brackets close.

Example 1: s = "(a)(b)"  ->  [[0, 2], [3, 5]]
Example 2: s = "((a))"  ->  [[1, 3], [0, 4]]
The inner pair closes first.
Example 3: s = "abc"  ->  []

Constraints: 0 <= len(s) <= 1000. `s` holds only lowercase letters, `(` and `)`.
