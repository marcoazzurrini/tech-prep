export function partitionLabels(s: string): number[] {
  const last = new Map<string, number>(); // letter -> its last index
  for (let i = 0; i < s.length; i++) last.set(s[i], i);

  const sizes: number[] = [];
  let start = 0;
  let end = 0; // the current part must reach at least this index
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i]) ?? i);
    // No letter of this part appears later: cut here.
    if (i === end) {
      sizes.push(i - start + 1);
      start = i + 1;
    }
  }
  return sizes;
}
