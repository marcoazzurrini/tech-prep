Write `Array.prototype.myFilter(callback)`. It works like the real `filter`: it returns a new array of the items for which the callback returns a truthy value.

The callback gets the item, its index and the array.

Example 1: [5, 12, 8].myFilter((n) => n > 6)  ->  [12, 8]
Example 2: ["a", "b", "c"].myFilter((item, i) => i !== 1)  ->  ["a", "c"]
