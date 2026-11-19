type TrieNode = { children: Map<string, TrieNode>; end: boolean };

export class Trie {
  private root: TrieNode = { children: new Map(), end: false };

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false });
      node = node.children.get(ch)!;
    }
    node.end = true;
  }

  private walk(s: string): TrieNode | null {
    let node: TrieNode | undefined = this.root;
    for (const ch of s) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  search(word: string): boolean {
    return this.walk(word)?.end ?? false;
  }

  startsWith(prefix: string): boolean {
    return this.walk(prefix) !== null;
  }
}
