export function centrePalindromeLengths(s: string): number[] {
  const lengths: number[] = [];
  for (let centre = 0; centre < 2 * s.length - 1; centre++) {
    // Even centres are letters. Odd centres are gaps.
    let left = Math.floor(centre / 2);
    let right = left + (centre % 2);
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    // The loop stops one step too far on both sides.
    lengths.push(right - left - 1);
  }
  return lengths;
}
