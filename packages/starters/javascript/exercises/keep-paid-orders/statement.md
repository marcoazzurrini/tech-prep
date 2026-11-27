# Keep Paid Orders (medium)

`paidOrderIds(orders)` should give the ids of the paid orders, in their order. It may return the ids or a promise of them.

`isPaid(order)` stands for a call to the bank, so it returns a promise of `true` or `false`.

The code below gives every id, paid or not. Fix it.

Example 1: paidOrderIds([{ id: "a", paid: true }, { id: "b", paid: false }])  ->  ["a"]
Example 2: paidOrderIds([])  ->  []
