export function countSubstrings(s: string): number {
  let count = 0;
  // Grow outwards from each of the 2n - 1 centers; every step that still matches is one palindrome.
  for (let center = 0; center < 2 * s.length - 1; center++) {
    let lo = Math.floor(center / 2);
    let hi = lo + (center % 2);
    while (lo >= 0 && hi < s.length && s[lo] === s[hi]) {
      count++;
      lo--;
      hi++;
    }
  }
  return count;
}
