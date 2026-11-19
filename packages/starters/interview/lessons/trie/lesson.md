# Trie

A trie is a tree of characters. Each node has one child per next character. So each path from the root spells a prefix, and words with the same prefix share the same nodes. A lookup takes one step per character.

## Worked example

Store three words. Then find the letters that can follow `"te"`.

```ts
type TrieNode = { children: Map<string, TrieNode>; end: boolean };
const root: TrieNode = { children: new Map(), end: false };

for (const word of ["tea", "ten", "to"]) {
  let node = root;
  for (const ch of word) {
    if (!node.children.has(ch))
      node.children.set(ch, { children: new Map(), end: false });
    node = node.children.get(ch)!;
  }
  node.end = true;
}

let node = root;
for (const ch of "te") node = node.children.get(ch)!;
// node.children has the keys "a" and "n"
```

## Why it works

- An insert walks down from the root. It makes a child only when the child is missing. So `"tea"` and `"ten"` share the nodes for `t` and `te`.
- `end` marks the node where a whole word stops. Without it, you cannot tell a word from a prefix.
- The cost is the length of the word. The number of stored words does not matter.

## When to use it

- The task asks about prefixes: "starts with", autocomplete, a shared prefix.
- You look up many words, character by character.
- A set of whole words is not enough, because you must stop early when no word continues.
