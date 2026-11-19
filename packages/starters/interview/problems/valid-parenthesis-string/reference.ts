export function checkValidString(s: string): boolean {
  let low = 0; // fewest open brackets possible so far
  let high = 0; // most open brackets possible so far
  for (const ch of s) {
    if (ch === "(") {
      low++;
      high++;
    } else if (ch === ")") {
      low--;
      high--;
    } else {
      // "*": one fewer, the same, or one more
      low--;
      high++;
    }
    // Even with every `*` as "(", there is a ")" too many.
    if (high < 0) return false;
    // An open count can never be negative.
    low = Math.max(low, 0);
  }
  return low === 0;
}
