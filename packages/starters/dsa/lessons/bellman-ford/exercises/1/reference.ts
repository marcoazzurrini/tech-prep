export function cheapestWithTickets(
  n: number,
  rides: number[][],
  tickets: number
): number[] {
  const price: number[] = new Array(n).fill(Infinity);
  price[0] = 0;
  // Each round adds one ride.
  for (let round = 0; round < tickets; round++) {
    // Read from the last round, so a round never chains two rides.
    const prev = [...price];
    for (const [a, b, cost] of rides) {
      price[b] = Math.min(price[b], prev[a] + cost);
    }
  }
  return price.map((p) => (p === Infinity ? -1 : p));
}
