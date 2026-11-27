export function orderTotal(prices, items) {
  let total = 0;

  for (const item of items) {
    if (Object.hasOwn(prices, item)) {
      total += prices[item];
    }
  }

  return total;
}
