`restock(products, sku, amount)` should return a new array, in which the product with that `sku` has `amount` more in `stock`.

It must not change `products`, or any product in it. A product that does not change stays the same object in the new array.

The code below changes the product it finds. Fix it.

Example 1:
  restock([{ sku: "pen", stock: 2 }, { sku: "ink", stock: 0 }], "ink", 5)
  ->  [{ sku: "pen", stock: 2 }, { sku: "ink", stock: 5 }]
