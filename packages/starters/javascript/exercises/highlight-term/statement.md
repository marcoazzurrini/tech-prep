# Highlight a Term (medium)

Write `highlightTerm(text, term)`. It returns `text` with every occurrence of `term` wrapped in square brackets. Letters match in any mix of capital and small, and each occurrence keeps its own spelling.

Spaces at the start and end of `term` do not count. If nothing is left, return `text` unchanged. The term may hold any character, such as `+`, `.` or `$`.

Example 1: highlightTerm("Tea or tea?", "tea")  ->  "[Tea] or [tea]?"
Example 2: highlightTerm("a.b and axb", "a.b")  ->  "[a.b] and axb"
Example 3: highlightTerm("Price: $5 or $50", " $5 ")  ->  "Price: [$5] or [$5]0"
Example 4: highlightTerm("Keep me", "   ")  ->  "Keep me"
