Write `cartPrices(items, priceOf)`. `priceOf(item)` returns a promise of the item's price.

Ask for every price at once. Return a promise of the prices, in the order of `items`.

Example 1: cartPrices(["tea", "bread"], async (item) => item.length)  ->  [3, 5]
Example 2: cartPrices([], priceOf)  ->  []
