# Labels for Paid Orders (medium)

Write `shippingLabels(orders)`. Each order looks like `{ id, paid, address }`. It returns the label text for every order that can ship, in order.

An order can ship when it is paid and its address has a city. The `address` may be missing or `null`, and its `city` may be missing or empty.

A label reads `"#"`, then the id, then `" to "`, then the city in capital letters.

Example 1: shippingLabels([{ id: 1, paid: true, address: { city: "Turin" } }])  ->  ["#1 to TURIN"]
Example 2: shippingLabels([{ id: 2, paid: false, address: { city: "Oslo" } }])  ->  []
Example 3: shippingLabels([{ id: 3, paid: true, address: null }])  ->  []
