# Can Ship Order (medium)

Write `canShipOrder(warehouse, orderLines)`.

`warehouse` is an array of `{ sku, qty }` objects. `orderLines` is an array of `{ sku, needed }` objects.

Return `true` when `orderLines` is not empty and every line has a matching `sku` in `warehouse` with `qty` at least `needed`. Return `false` otherwise.

Example 1:
  canShipOrder([{ sku: "A", qty: 5 }, { sku: "B", qty: 2 }], [{ sku: "A", needed: 3 }, { sku: "B", needed: 2 }])  ->  true
Example 2:
  canShipOrder([{ sku: "A", qty: 1 }], [{ sku: "A", needed: 3 }])  ->  false
Example 3:
  canShipOrder([{ sku: "A", qty: 5 }], [])  ->  false
