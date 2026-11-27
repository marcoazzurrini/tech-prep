# Place an Order (medium)

Write `placeOrder(order)`. It returns a promise of a short text about what happened.

First `reserve(order)`, then `charge` the reserved order. Both return promises. If both succeed, the text is `"shipped "` and the item, such as `"shipped lamp"`.

`reserve` can reject with an `OutOfStockError`. Then the text is `"sold out"`, and nothing is charged. `charge` can reject with a `PaymentError`. Then the text is `"payment failed"`. Any other error must still reject, unchanged.

Example 1: placeOrder({ item: "lamp", quantity: 2, card: "valid" })  ->  a promise of "shipped lamp"
Example 2: placeOrder({ item: "lamp", quantity: 9, card: "valid" })  ->  a promise of "sold out"
Example 3: placeOrder({ item: "desk", quantity: 1, card: "expired" })  ->  a promise of "payment failed"
Example 4: placeOrder({ quantity: 1, card: "valid" })  ->  rejects with the "no item" error
