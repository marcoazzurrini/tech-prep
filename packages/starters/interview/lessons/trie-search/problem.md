# Words from Letter Choices (easy)

You get a list of `words` and a list of strings `choices`. To spell a word, pick one letter from `choices[0]`, then one from `choices[1]`, and so on, one letter from each string. Return how many of the `words` you can spell this way.

A word you can spell has exactly as many letters as `choices` has strings. Build a trie of the words, then search it with a DFS.

Example 1: words = ["cat", "cot", "dog", "cut"], choices = ["cd", "ao", "t"] -> 2 ("cat" and "cot") Example 2: words = ["at", "ate"], choices = ["a", "t"] -> 1 ("ate" is too long) Example 3: words = ["a"], choices = ["b"] -> 0

Constraints: 0 <= len(words) <= 100, 1 <= len(choices) <= 6, 1 <= len(choices[i]) <= 5, lowercase English letters, the words are all different, the letters inside one `choices[i]` are all different.
