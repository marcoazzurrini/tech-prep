type TrieNode = Map<string, TrieNode>;

export function countDistinctPrefixes(words: string[]): number {
  const root: TrieNode = new Map();
  let count = 0;
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      // Each trie node is one prefix. A new node is a new prefix.
      if (!node.has(ch)) {
        node.set(ch, new Map());
        count++;
      }
      node = node.get(ch)!;
    }
  }
  return count;
}
