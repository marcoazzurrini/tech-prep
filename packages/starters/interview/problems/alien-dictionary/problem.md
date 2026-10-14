# Alien Dictionary (hard)

An alien language uses lowercase English letters in an unknown order. You get a list of `words` that is claimed to be sorted in that alien order. Return a string of all the letters that appear in `words`, arranged in an order consistent with the list. If no order is consistent with the list, return `""`. If several orders work, any one of them is accepted.

Example 1: words = ["wrt", "wrf", "er", "ett", "rftt"]  ->  "wertf"
Example 2: words = ["z", "x", "z"]  ->  ""  (z before x and x before z)
Example 3: words = ["abc", "ab"]  ->  ""  (a word cannot come before its own prefix)

Constraints: 1 <= len(words) <= 100, 1 <= word length <= 100, lowercase English letters.
