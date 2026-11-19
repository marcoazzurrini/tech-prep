export function searchDescending(scores: number[], target: number): number {
  let lo = 0;
  let hi = scores.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (scores[mid] === target) return mid;
    // Largest first: a score that is too large means the target is to the right.
    if (scores[mid]! > target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
