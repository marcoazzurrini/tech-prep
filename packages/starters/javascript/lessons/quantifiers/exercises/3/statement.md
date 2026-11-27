`quotedPhrases(text)` should return every phrase in double quotes, without its quotes, in order. A phrase may be empty.

The code below joins the phrases into one when there are two or more. Fix it.

Example 1: quotedPhrases('say "hi" and "bye"')  ->  ["hi", "bye"]
Example 2: quotedPhrases('"" and "x"')  ->  ["", "x"]
Example 3: quotedPhrases("no quotes")  ->  []
