export function priceAll(items, lookup) {
  const prices = new Map();

  return items.map((item) => prices.getOrInsertComputed(item, lookup));
}
