# Word Search (medium)

Given a grid of letters `board` and a string `word`, return `true` if `word` can be spelled by a path of horizontally or vertically adjacent cells. The same cell may not be used twice in one path.

Example 1: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"  ->  true
Example 2: same board, word = "SEE"  ->  true
Example 3: same board, word = "ABCB"  ->  false  (the "B" cell would be reused)

Constraints: 1 <= rows, cols <= 6, 1 <= len(word) <= 15, upper- and lowercase English letters.
Follow-up: can you prune the search so it gives up early on hopeless boards?
