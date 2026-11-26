# Mark as Shipped (medium)

Write `markShipped(orders, id)`. `orders` is an array of orders such as `{ id: 7, status: "paid", history: ["paid"] }`.

It returns a new array of orders. In it, the order with that `id` has the status `"shipped"`, and `"shipped"` is added at the end of its `history`. Every other order has the same content as before.

Nothing that was passed in may change: not the array, not an order, not a `history`.

Example 1:
  markShipped([{ id: 7, status: "paid", history: ["paid"] }], 7)
  ->  [{ id: 7, status: "shipped", history: ["paid", "shipped"] }]
Example 2:
  markShipped([{ id: 1, status: "new", history: [] }], 5)
  ->  [{ id: 1, status: "new", history: [] }]
