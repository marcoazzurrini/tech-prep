export function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n = (n & (n - 1)) >>> 0; // clears the lowest set bit
    count++;
  }
  return count;
}
