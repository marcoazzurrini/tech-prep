# First Answer (medium)

Write `firstAnswer(askers)`. `askers` is an array of functions. Call them in order, with no arguments.

Return the first result that is not `undefined`. Do not call the functions that come after it. When no function gives a result, return `"no answer"`.

Example 1: firstAnswer([() => {}, () => 7, () => 9])  ->  7
Example 2: firstAnswer([() => null, () => 1])  ->  null
Example 3: firstAnswer([])  ->  "no answer"
