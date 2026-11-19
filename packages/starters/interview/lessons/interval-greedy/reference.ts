export function maxBookingsWithBreak(
  bookings: number[][],
  rest: number
): number {
  // The booking that ends first leaves the most room for the rest.
  const sorted = [...bookings].sort((a, b) => a[1]! - b[1]!);
  let count = 0;
  let freeAt = -Infinity; // the first time the room can be used again
  for (const booking of sorted) {
    if (booking[0]! >= freeAt) {
      count++;
      freeAt = booking[1]! + rest;
    }
  }
  return count;
}
