# Set an Item Count (medium)

A cart looks like `{ coupon: "A1", items: [{ sku: "pen", count: 1 }] }`. No two items have the same `sku`.

Write `setCount(cart, sku, count)`. It returns a new cart in which the item with that `sku` has that `count`:

- An item that is in the cart gets the new count.
- An item that is not in the cart is added at the end, as `{ sku, count }`.
- A count of `0` means the cart has no item with that `sku`.

The function must not change `cart` or any item in it. An item that does not change stays the same object in the new cart.

Example 1: setCount({ items: [{ sku: "pen", count: 1 }] }, "pen", 3)  ->  { items: [{ sku: "pen", count: 3 }] }
Example 2: setCount({ items: [{ sku: "pen", count: 1 }] }, "ink", 2)  ->  { items: [{ sku: "pen", count: 1 }, { sku: "ink", count: 2 }] }
Example 3: setCount({ items: [{ sku: "pen", count: 1 }] }, "pen", 0)  ->  { items: [] }
