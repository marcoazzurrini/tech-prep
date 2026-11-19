# Longest Letter Chain (easy)

You have a list of `words`. Pick some of the words and keep them in their original order. They form a chain when every picked word starts with the last letter of the picked word before it.

Return the number of words in the longest chain.

Example 1: words = ["apple", "egg", "tiger", "goat", "rat"] -> 3 The chain is "apple", "egg", "goat". Example 2: words = ["cat", "dog"] -> 1 Example 3: words = [] -> 0

Constraints: 0 <= len(words) <= 500, 1 <= len(words[i]) <= 10, lowercase English letters.
