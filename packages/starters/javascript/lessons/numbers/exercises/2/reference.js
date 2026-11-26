export function totalInCents(prices) {
  let total = 0;

  for (const price of prices) {
    total += Math.round(price * 100);
  }

  return total;
}
