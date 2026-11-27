# Score Summary (medium)

Write `summarize(scores)`. It takes a list of scores and returns an object with three numbers: `lowest`, `highest` and `average`.

Round the average to one decimal. A value exactly halfway rounds up, so `7.75` becomes `7.8`.

For an empty list, all three values are `null`.

Example 1: summarize([7, 3, 9, 5])  ->  { lowest: 3, highest: 9, average: 6 }
Example 2: summarize([2, 3, 3])  ->  { lowest: 2, highest: 3, average: 2.7 }
Example 3: summarize([])  ->  { lowest: null, highest: null, average: null }
