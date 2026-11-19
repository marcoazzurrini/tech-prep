export function maxLetterInWindow(
  s: string,
  k: number,
  letter: string
): number {
  let count = 0; // how often letter is in the current window
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === letter) count++; // enters on the right
    if (i >= k && s[i - k] === letter) count--; // leaves on the left
    if (i >= k - 1) best = Math.max(best, count); // the window is full
  }
  return best;
}
