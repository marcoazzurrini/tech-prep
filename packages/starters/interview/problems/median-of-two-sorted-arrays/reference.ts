export function findMedianSortedArrays(
  nums1: number[],
  nums2: number[]
): number {
  // Search the cut in the shorter array.
  const [a, b] =
    nums1.length <= nums2.length ? [nums1, nums2] : [nums2, nums1];
  const half = Math.floor((a.length + b.length + 1) / 2); // size of the left part

  let lo = 0;
  let hi = a.length;
  for (;;) {
    const i = Math.floor((lo + hi) / 2); // values taken from a
    const j = half - i; // the cut in b follows
    const aLeft = a[i - 1] ?? -Infinity;
    const aRight = a[i] ?? Infinity;
    const bLeft = b[j - 1] ?? -Infinity;
    const bRight = b[j] ?? Infinity;

    if (aLeft > bRight) {
      hi = i - 1; // took too many from a
    } else if (bLeft > aRight) {
      lo = i + 1; // took too few from a
    } else {
      // Everything on the left is at most everything on the right.
      if ((a.length + b.length) % 2 === 1) return Math.max(aLeft, bLeft);
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    }
  }
}
