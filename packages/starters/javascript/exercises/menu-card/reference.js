export function menuCard(dishes, symbol) {
  const decimals = 2;
  const heading = () => `Menu (${symbol})`;
  const line = (dish) => `${dish.name}: ${symbol}${dish.price.toFixed(decimals)}`;

  return { title: heading(), lines: dishes.map(line) };
}
