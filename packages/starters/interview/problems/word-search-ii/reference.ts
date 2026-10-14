type TrieNode = { children: Map<string, TrieNode>; word: string | null };

export function findWords(board: string[][], words: string[]): string[] {
  const root: TrieNode = { children: new Map(), word: null };
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), word: null });
      node = node.children.get(ch)!;
    }
    node.word = w;
  }

  const rows = board.length;
  const cols = board[0]!.length;
  const found: string[] = [];

  const dfs = (r: number, c: number, parent: TrieNode): void => {
    const ch = board[r]![c]!;
    const node = parent.children.get(ch)!;
    if (node.word !== null) {
      found.push(node.word);
      node.word = null; // report each word once
    }
    board[r]![c] = "#";
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]] as const) {
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && node.children.has(board[nr]![nc]!)) dfs(nr, nc, node);
    }
    board[r]![c] = ch;
    if (node.children.size === 0 && node.word === null) parent.children.delete(ch); // prune
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (root.children.has(board[r]![c]!)) dfs(r, c, root);
    }
  }
  return found;
}
