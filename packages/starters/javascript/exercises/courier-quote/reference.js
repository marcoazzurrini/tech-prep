export function courierQuote(km, { rate = 2, minimum = 5 } = {}) {
  return Math.max(km * rate, minimum);
}
