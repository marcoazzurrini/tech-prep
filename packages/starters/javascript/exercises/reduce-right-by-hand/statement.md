# reduceRight by Hand (medium)

Write `Array.prototype.myReduceRight(callback, start)`. It works like the real `reduceRight`: it folds the array from the last item to the first.

- The callback gets the value so far, the item, its index and the array.
- When the call passes `start`, even as `undefined`, that is the first value so far.
- When the call leaves `start` out, the last item is the first value so far, and the fold goes on from the item before it.
- Holes are skipped.
- With no items and no `start`, it throws a `TypeError`.

Example 1: ["a", "b", "c"].myReduceRight((text, s) => text + s)  ->  "cba"
Example 2: [1, 2].myReduceRight((list, n) => [...list, n], [])  ->  [2, 1]
Example 3: [].myReduceRight((a, b) => a + b, 0)  ->  0
