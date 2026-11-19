# Word Break (medium)

Given a string `s` and a list of dictionary words `word_dict`, return true if `s` can be split into a sequence of one or more dictionary words with nothing left over. A word may be used any number of times.

Example 1: s = "leetcode", word_dict = ["leet", "code"]  ->  true
Example 2: s = "applepenapple", word_dict = ["apple", "pen"]  ->  true  (apple + pen + apple)
Example 3: s = "catsandog", word_dict = ["cats", "dog", "sand", "and", "cat"]  ->  false

Constraints: 1 <= len(s) <= 300, 1 <= len(word_dict) <= 1000, 1 <= len(word) <= 20, all words are distinct and lowercase.
