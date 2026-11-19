# Searching with a Trie

Some searches try many strings, one letter at a time. Walk a trie of the valid words at the same time. Each letter moves one node down. When the node has no child for the next letter, no word starts that way. Stop the whole branch there.

## Worked example

Find the words you can build from the tiles `a`, `t` and `e`. Each tile is used at most once.

```ts
// root: a trie that holds "at", "ate", "tea" and "ten"
const found: string[] = [];

function dfs(node: TrieNode, tiles: string[], path: string): void {
  if (node.end) found.push(path);
  for (let i = 0; i < tiles.length; i++) {
    const child = node.children.get(tiles[i]);
    if (!child) continue;
    const rest = [...tiles.slice(0, i), ...tiles.slice(i + 1)];
    dfs(child, rest, path + tiles[i]);
  }
}

dfs(root, ["a", "t", "e"], "");
// found: ["at", "ate", "tea"]
```

## Why it works

- The DFS carries a trie node. The node tells which prefix the path has spelled.
- `if (!child) continue` cuts the branch. No word starts with `"e"`, so nothing below it is tried.
- `node.end` reports a word at any depth, and the search still goes deeper.

## When to use it

- You search for many words at once: in a grid, in a set of tiles, in a pattern.
- A pattern has wildcards or choices, so one position can match several letters.
- A plain DFS would try many paths that are not the start of any word.
