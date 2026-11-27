const seatNames = ({ row, seats }) =>
  Array.from({ length: seats }, (_, i) => row + (i + 1));

export function firstSeats(rows, n) {
  return Iterator.from(rows).flatMap(seatNames).take(n).toArray();
}
