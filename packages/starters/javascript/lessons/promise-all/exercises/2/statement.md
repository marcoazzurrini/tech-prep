Write `priceList(items)`. It returns a promise of the prices of `items`, in the same order. `fetchPrice(item)` gives a promise of one price.

If a price is missing, the promise fulfils with the error's `message` instead.

Example 1: priceList(["tea", "cake"])  ->  [3, 4]
Example 2: priceList([])  ->  []
Example 3: priceList(["tea", "soup"])  ->  "no price for soup"
