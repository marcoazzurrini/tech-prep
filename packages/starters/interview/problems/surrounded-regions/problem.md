# Surrounded Regions (medium)

Each cell of `board` is `"X"` or `"O"`. A region is a group of `"O"` cells connected horizontally or vertically. A region is surrounded when none of its cells is on the border of the board.

Change every cell of every surrounded region to `"X"`. Leave the other regions as they are.

Do it in place: change `board` directly. The function returns nothing; the board itself is checked.

Example 1: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]  ->  [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
Example 2: board = [["X","O","X"],["X","O","X"],["X","X","X"]]  ->  [["X","O","X"],["X","O","X"],["X","X","X"]]  (the region touches the top border)

Constraints: 1 <= rows, cols <= 200.
