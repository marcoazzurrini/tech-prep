export function groupByLength(words: string[]): string[][] {
  // The key is the length: words of one group share it.
  const groups = new Map<number, string[]>();
  for (const word of words) {
    const group = groups.get(word.length) ?? [];
    group.push(word);
    groups.set(word.length, group);
  }
  return [...groups.values()];
}
