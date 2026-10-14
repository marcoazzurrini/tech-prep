# Word Search II (hard)

Given a grid of letters `board` and a list of distinct `words`, return every word that can be spelled on the board. A word is spelled by a path of horizontally or vertically adjacent cells, and a cell may be used at most once within the same word. Return the words in any order.

Example 1: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]  ->  ["eat","oath"]
Example 2: board = [["a","b"],["c","d"]], words = ["abcb"]  ->  []  (it would need to reuse the "b" cell)

Constraints: 1 <= rows, cols <= 12, lowercase letters, 1 <= len(words) <= 3 * 10^4, 1 <= word length <= 10, words are distinct.
