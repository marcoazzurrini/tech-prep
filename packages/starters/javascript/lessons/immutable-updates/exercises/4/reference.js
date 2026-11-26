export function setPrice(prices, item, price) {
  if (price === null) {
    const { [item]: removed, ...rest } = prices;

    return rest;
  }

  return { ...prices, [item]: price };
}
