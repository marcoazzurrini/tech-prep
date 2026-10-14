# Implement Trie (Prefix Tree) (medium)

Implement a class `Trie` with:
- `Trie()`: creates an empty trie.
- `insert(word)`: adds `word`.
- `search(word)`: returns `true` if `word` was inserted before.
- `startsWith(prefix)`: returns `true` if any inserted word starts with `prefix`.

Example:
  ops  = ["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
  args = [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
  ->     [null, null, true, false, true, null, true]

Constraints: 1 <= length of word and prefix <= 2000, lowercase English letters, at most 3 * 10^4 calls.
