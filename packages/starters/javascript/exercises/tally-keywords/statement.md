# Tally Keywords (easy)

Write `tallyKeywords(text, keywords)`. It returns an object with one key for each keyword. Its value is how many times the keyword appears in `text`, in any mix of capital and small letters.

A keyword may hold any character, such as `+`, `.` or `(`.

Example 1: tallyKeywords("Tea, TEA and coffee", ["tea", "coffee", "milk"])  ->  { tea: 2, coffee: 1, milk: 0 }
Example 2: tallyKeywords("v1.0 and v100", ["v1.0"])  ->  { "v1.0": 1 }
Example 3: tallyKeywords("anything", [])  ->  {}
