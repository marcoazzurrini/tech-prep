const EMPTY_ROW = ["-", "-", "-", "-", "-"];

export function seatRow(taken) {
  const row = [...EMPTY_ROW];

  for (const seat of taken) {
    row[seat] = "X";
  }

  return row.join("");
}
