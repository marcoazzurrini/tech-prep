export function cheapItems(prices, limit) {
  const result = [];

  for (const [item, price] of prices) {
    if (price <= limit) {
      result.push(item);
    }
  }

  return result;
}
