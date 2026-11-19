export class DetectSquares {
  // counts.get("x,y") = how many times this point was added.
  private counts = new Map<string, number>();

  add(point: number[]): void {
    const key = `${point[0]},${point[1]}`;
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
  }

  count(point: number[]): number {
    const x = point[0]!;
    const y = point[1]!;
    let total = 0;
    // Try every stored point as the opposite corner of the square.
    for (const [key, diagonal] of this.counts) {
      const [px, py] = key.split(",").map(Number) as [number, number];
      if (px === x || Math.abs(px - x) !== Math.abs(py - y)) continue;
      // The other two corners are fixed. Multiply the counts of the three corners.
      total += diagonal * (this.counts.get(`${x},${py}`) ?? 0) * (this.counts.get(`${px},${y}`) ?? 0);
    }
    return total;
  }
}
