export function setBitPositions(n: number): number[] {
  const positions: number[] = [];
  let position = 0;
  while (n > 0) {
    // n & 1 reads the lowest bit. n >> 1 drops it.
    if ((n & 1) === 1) positions.push(position);
    n >>= 1;
    position++;
  }
  return positions;
}
