# Edit Distance (medium)

Return the smallest number of edits that turn `word1` into `word2`. One edit is one of these:
- insert one character
- delete one character
- replace one character with another

Example 1: word1 = "horse", word2 = "ros"  ->  3  (horse, rorse, rose, ros)
Example 2: word1 = "intention", word2 = "execution"  ->  5
Example 3: word1 = "", word2 = "abc"  ->  3

Constraints: 0 <= len(word1), len(word2) <= 500, lowercase English letters.
