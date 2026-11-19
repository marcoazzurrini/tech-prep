type TrieNode = { children: Map<string, TrieNode>; end: boolean };

export function countSpellable(words: string[], choices: string[]): number {
  const root: TrieNode = { children: new Map(), end: false };
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch))
        node.children.set(ch, { children: new Map(), end: false });
      node = node.children.get(ch)!;
    }
    node.end = true;
  }

  function dfs(node: TrieNode, i: number): number {
    if (i === choices.length) return node.end ? 1 : 0;
    let count = 0;
    for (const ch of choices[i]) {
      // Follow a letter only when some word continues with it.
      const child = node.children.get(ch);
      if (child) count += dfs(child, i + 1);
    }
    return count;
  }

  return dfs(root, 0);
}
