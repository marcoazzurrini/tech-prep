# Read Ends (medium)

Write `readEnds(items, offset = 1)`. It returns an object `{ fromStart, fromEnd }`.

`fromStart` is the item at `offset - 1`, and `fromEnd` is the item `offset` positions from the end. Use `null` for either side if `offset` is out of range.

Example 1: readEnds(["a", "b", "c", "d"])  ->  { fromStart: "a", fromEnd: "d" }
Example 2: readEnds(["a", "b", "c", "d"], 2)  ->  { fromStart: "b", fromEnd: "c" }
Example 3: readEnds([10, 20], 5)  ->  { fromStart: null, fromEnd: null }

Constraints: `offset` is a positive whole number.
