function sumPrices(prices) {
  return prices.reduce((sum, price) => sum + price, 0);
}

function countOver(prices, limit) {
  return prices.filter((price) => price > limit).length;
}

export { sumPrices as total, countOver as countAbove };
