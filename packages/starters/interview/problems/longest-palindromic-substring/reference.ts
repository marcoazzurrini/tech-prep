export function longestPalindrome(s: string): string {
  const expand = (lo: number, hi: number): [number, number] => {
    while (lo >= 0 && hi < s.length && s[lo] === s[hi]) {
      lo--;
      hi++;
    }
    return [lo + 1, hi];
  };

  let start = 0;
  let end = 1;
  // Every palindrome has a center: a character (odd length) or a gap (even length).
  for (let i = 0; i < s.length; i++) {
    for (const [lo, hi] of [expand(i, i), expand(i, i + 1)]) {
      if (hi - lo > end - start) {
        start = lo;
        end = hi;
      }
    }
  }
  return s.slice(start, end);
}
