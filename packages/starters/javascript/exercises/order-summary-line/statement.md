# Order Summary (medium)

`orderSummary(order)` should return one line of text: the customer's name, then the tip.

- The name is `order.customer.name`. Use `"Guest"` when `order.customer` is `null`, or when the name is empty.
- The tip is `order.tip`, a percentage. Use `10` when the order has no `tip` property. A tip of `0` is a real tip.

The code below gives the wrong text for some orders. Fix it.

Example 1: orderSummary({ customer: { name: "Ada" }, tip: 15 })  ->  "Ada, tip 15%"
Example 2: orderSummary({ customer: null, tip: 0 })  ->  "Guest, tip 0%"
Example 3: orderSummary({ customer: { name: "" } })  ->  "Guest, tip 10%"
