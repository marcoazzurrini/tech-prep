# Words by First Letter (easy)

Write `byFirstLetter(words)`. It takes an array of words and returns an object. Each key is a first letter. Its value is an array of the words that start with that letter, in their original order.

Example 1: byFirstLetter(["apple", "bee", "ant"])  ->  { a: ["apple", "ant"], b: ["bee"] }
Example 2: byFirstLetter([])  ->  {}

Note: Every word has at least one letter. Solve it without `Object.groupBy`.
