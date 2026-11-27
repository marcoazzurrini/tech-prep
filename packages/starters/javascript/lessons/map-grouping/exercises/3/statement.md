Write `priceAll(items, lookup)`. It returns the price of each item, in order. `lookup(item)` gives the price of one item, but it is slow.

Call `lookup` only once for each different item. Reuse the price for an item you have seen.

Example 1: priceAll(["tea", "cake", "tea"], (i) => i.length)  ->  [3, 4, 3], with 2 calls to `lookup`
Example 2: priceAll([], lookup)  ->  []
