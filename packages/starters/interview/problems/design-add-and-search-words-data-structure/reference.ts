type TrieNode = { children: Map<string, TrieNode>; end: boolean };

export class WordDictionary {
  private root: TrieNode = { children: new Map(), end: false };

  addWord(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false });
      node = node.children.get(ch)!;
    }
    node.end = true;
  }

  search(word: string): boolean {
    const match = (node: TrieNode, i: number): boolean => {
      if (i === word.length) return node.end;
      const ch = word[i]!;
      if (ch === ".") {
        for (const child of node.children.values()) if (match(child, i + 1)) return true;
        return false;
      }
      const next = node.children.get(ch);
      return next !== undefined && match(next, i + 1);
    };
    return match(this.root, 0);
  }
}
