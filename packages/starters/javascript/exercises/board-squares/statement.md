# Board Squares (medium)

Write `makeBoard()`. It returns a board for a game. The board has no size limit, and it starts empty. It has three methods:

- `place(row, column, piece)` puts a piece on a square. It replaces a piece that is already there.
- `pieceAt(row, column)` returns the piece on a square, or `null` when the square is empty.
- `move(fromRow, fromColumn, toRow, toColumn)` moves a piece to another square and leaves the first square empty. It does nothing when the first square is empty.

Rows and columns are whole numbers from 0 up, and a piece is a string. Each board is separate from the others.

Example 1:
  const board = makeBoard();
  board.place(2, 3, "rook");
  board.pieceAt(2, 3)  ->  "rook"
  board.pieceAt(3, 2)  ->  null
