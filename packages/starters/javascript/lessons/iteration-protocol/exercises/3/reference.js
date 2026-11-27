export function report(prices) {
  const names = [...prices.keys()];
  const total = [...prices.values()].reduce((sum, price) => sum + price, 0);

  return `${names.join(",")}: ${total}`;
}
