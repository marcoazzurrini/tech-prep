export function checkInclusion(s1: string, s2: string): boolean {
  const k = s1.length;
  if (k > s2.length) return false;
  const need = new Array<number>(26).fill(0); // letter counts of s1
  const window = new Array<number>(26).fill(0); // letter counts of the current window of s2
  for (const c of s1) need[c.charCodeAt(0) - 97]++;
  for (let i = 0; i < s2.length; i++) {
    window[s2.charCodeAt(i) - 97]++; // enters on the right
    if (i >= k) window[s2.charCodeAt(i - k) - 97]--; // leaves on the left
    // Same counts means the window is a rearrangement of s1.
    if (window.every((n, j) => n === need[j])) return true;
  }
  return false;
}
