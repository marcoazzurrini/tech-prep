A price list looks like `{ pen: 2, ink: 5 }`.

Write `setPrice(prices, item, price)`. It returns a new price list in which `item` costs `price`. When `price` is `null`, the result does not have the item at all.

The function must not change `prices`.

Example 1: setPrice({ pen: 2 }, "ink", 5)  ->  { pen: 2, ink: 5 }
Example 2: setPrice({ pen: 2, ink: 5 }, "pen", 3)  ->  { pen: 3, ink: 5 }
Example 3: setPrice({ pen: 2, ink: 5 }, "ink", null)  ->  { pen: 2 }
