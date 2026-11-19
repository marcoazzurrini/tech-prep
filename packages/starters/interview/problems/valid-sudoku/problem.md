# Valid Sudoku (medium)

You get a 9 x 9 Sudoku `board`. Each cell holds a digit from `"1"` to `"9"`, or `"."` for an empty cell. Return `true` if the filled cells break no rule, and `false` otherwise.

The rules:

- No digit appears twice in a row.
- No digit appears twice in a column.
- No digit appears twice in one of the nine 3 x 3 boxes.

Only check the cells that are filled. The board does not have to be solvable.

Example 1: board =
  [["5","3",".",".","7",".",".",".","."],
   ["6",".",".","1","9","5",".",".","."],
   [".","9","8",".",".",".",".","6","."],
   ["8",".",".",".","6",".",".",".","3"],
   ["4",".",".","8",".","3",".",".","1"],
   ["7",".",".",".","2",".",".",".","6"],
   [".","6",".",".",".",".","2","8","."],
   [".",".",".","4","1","9",".",".","5"],
   [".",".",".",".","8",".",".","7","9"]]  ->  true
Example 2: the same board with `"8"` in the top-left cell  ->  false
  The first column and the top-left box then hold `"8"` twice.

Constraints: `board` has 9 rows of 9 cells. Each cell is a digit from `"1"` to `"9"` or `"."`.
