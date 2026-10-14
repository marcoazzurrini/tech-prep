# Design Add and Search Words Data Structure (medium)

Implement a class `WordDictionary` that stores words and answers lookups where `.` matches any single letter:
- `WordDictionary()`: creates an empty dictionary.
- `addWord(word)`: stores `word`.
- `search(word)`: returns `true` if some stored word matches `word` exactly, letter by letter, with each `.` standing for any one letter.

Example:
  ops  = ["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"]
  args = [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]
  ->     [null, null, null, null, false, true, true, true]

Constraints: 1 <= word length <= 25, words passed to `addWord` are lowercase letters, words passed to `search` are lowercase letters or `.` (at most 2 dots), at most 10^4 calls.
