export function countFromFirst(a: number[], b: number[], k: number): number {
  // i values come from a, so k - i come from b. Both counts must fit.
  let lo = Math.max(0, k - b.length);
  let hi = Math.min(k, a.length);
  while (lo < hi) {
    const i = (lo + hi) >> 1;
    const j = k - i; // the cut in b follows
    if (b[j - 1]! > a[i]!) {
      lo = i + 1; // a[i] belongs on the left: take more from a
    } else {
      hi = i; // a[i] belongs on the right: do not take more
    }
  }
  return lo;
}
