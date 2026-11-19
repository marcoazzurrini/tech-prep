export function countRecordLows(prices: number[]): number {
  let lowest = Infinity; // lowest price on the earlier days
  let count = 0;
  for (const price of prices) {
    if (price < lowest) {
      count++;
      lowest = price;
    }
  }
  return count;
}
