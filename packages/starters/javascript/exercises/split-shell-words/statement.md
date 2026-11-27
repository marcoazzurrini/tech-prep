# Split Shell Words (medium)

Write `splitWords(command)`. It splits a command line into words, the way a shell does. Words are separated by one or more spaces. A word is either text with no spaces and no quotes, or text in double quotes. The text in quotes may hold spaces, and the quotes are not part of the word.

When a double quote is never closed, throw a `SyntaxError` with the message `Unclosed quote at N`. N is the index of the opening quote.

Example 1: splitWords('git commit -m "first try"')  ->  ["git", "commit", "-m", "first try"]
Example 2: splitWords("  ls   -la  ")  ->  ["ls", "-la"]
Example 3: splitWords('echo "" done')  ->  ["echo", "", "done"]
Example 4: splitWords('say "hi there')  ->  throws SyntaxError("Unclosed quote at 4")

Note: a quote always comes at the start of a word.
