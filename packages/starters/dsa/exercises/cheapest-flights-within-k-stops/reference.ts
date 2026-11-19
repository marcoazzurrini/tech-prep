export function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
  const price: number[] = new Array(n).fill(Infinity); // cheapest price to each city so far
  price[src] = 0;
  // k stops allow k + 1 flights. Each round adds one flight.
  for (let round = 0; round <= k; round++) {
    // Read from the last round, so a round never chains two flights.
    const prev = [...price];
    for (const [a, b, cost] of flights) {
      if (prev[a] + cost < price[b]) price[b] = prev[a] + cost;
    }
  }
  return price[dst] === Infinity ? -1 : price[dst];
}
