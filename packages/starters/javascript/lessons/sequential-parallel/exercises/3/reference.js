export async function cartPrices(items, priceOf) {
  return Promise.all(items.map((item) => priceOf(item)));
}
