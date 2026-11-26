export function seatsTogether(rows, size) {
  for (let row = 0; row < rows.length; row++) {
    let free = 0;

    for (let seat = 0; seat < rows[row].length; seat++) {
      if (rows[row][seat] !== ".") {
        free = 0;
        continue;
      }

      free++;

      if (free === size) {
        return [row, seat - size + 1];
      }
    }
  }

  return null;
}
