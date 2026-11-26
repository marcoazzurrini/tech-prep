# Delivery Fee (medium)

`deliveryFee(order)` should return what it costs to deliver an order.

- The parcel weighs `items` times `itemWeight`, plus `boxWeight`. A missing `boxWeight` counts as 1.
- The fee is 4, plus 2 for each unit of weight.
- Delivery is free for a member, and for a `total` over 50. An `express` order is never free.

The code below gets some orders wrong. Fix it.

Example 1: deliveryFee({ items: 2, itemWeight: 3, boxWeight: 1, total: 20 })  ->  18
Example 2: deliveryFee({ items: 2, itemWeight: 3, total: 20 })  ->  18
Example 3: deliveryFee({ items: 1, itemWeight: 1, boxWeight: 0, total: 80 })  ->  0
Example 4: deliveryFee({ items: 4, itemWeight: 2, total: 10, member: true, express: true })  ->  22
