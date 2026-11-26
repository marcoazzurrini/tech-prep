const keyOf = (row, column) => `${row},${column}`;

export function makeBoard() {
  const squares = {};

  return {
    place(row, column, piece) {
      squares[keyOf(row, column)] = piece;
    },

    pieceAt(row, column) {
      return squares[keyOf(row, column)] ?? null;
    },

    move(fromRow, fromColumn, toRow, toColumn) {
      const from = keyOf(fromRow, fromColumn);
      const piece = squares[from];

      if (piece === undefined) {
        return;
      }

      delete squares[from];
      squares[keyOf(toRow, toColumn)] = piece;
    },
  };
}
