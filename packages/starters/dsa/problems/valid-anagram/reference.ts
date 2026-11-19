export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const counts = new Map<string, number>();
  for (const c of s) counts.set(c, (counts.get(c) ?? 0) + 1);
  for (const c of t) {
    const left = (counts.get(c) ?? 0) - 1;
    if (left < 0) return false;
    counts.set(c, left);
  }
  return true;
}
