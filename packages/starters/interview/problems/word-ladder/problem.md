# Word Ladder (hard)

A ladder is a list of words that starts with `beginWord` and ends with `endWord`. Each word differs from the word before it by exactly one letter. Every word after `beginWord` must be in `wordList`.

Return the number of words in the shortest ladder. `beginWord` counts. Return `0` if there is no ladder.

Example 1: beginWord = "hit", endWord = "cog", wordList = ["hot", "dot", "dog", "lot", "log", "cog"]  ->  5
  (hit, hot, dot, dog, cog)
Example 2: beginWord = "hit", endWord = "cog", wordList = ["hot", "dot", "dog", "lot", "log"]  ->  0
  ("cog" is not in the list)

Constraints: 1 <= beginWord.length <= 10, all words have the same length, lowercase English letters, 1 <= wordList.length <= 5000, beginWord != endWord, the words of wordList are distinct.
