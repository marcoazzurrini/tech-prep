export function wrapIndex(ids: number[]): number {
  let lo = 0;
  let hi = ids.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1; // round up, so mid is never lo
    if (ids[mid]! > ids[lo]!) {
      // lo..mid is sorted: the largest ID is at mid or to its right.
      lo = mid;
    } else {
      // The drop is between lo and mid: the largest ID is left of mid.
      hi = mid - 1;
    }
  }
  return lo;
}
