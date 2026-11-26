export function cheapest(prices) {
  let best = Infinity;

  for (const price of prices) {
    if (price !== null && price < best) {
      best = price;
    }
  }

  return best;
}
