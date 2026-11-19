export function heaviestPairUnderLimit(
  weights: number[],
  limit: number
): number {
  let left = 0;
  let right = weights.length - 1;
  let best = -1;
  while (left < right) {
    const total = weights[left] + weights[right];
    if (total <= limit) {
      best = Math.max(best, total);
      left++; // this is the best partner for left; try a heavier left
    } else {
      right--; // right is too heavy for every item that remains
    }
  }
  return best;
}
