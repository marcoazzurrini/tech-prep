Write `discountFor(order, customer)`. It returns the first discount that is set: the order's `discount`, then the customer's `discount`, then `0`.

A discount is set when it is not `null` and not `undefined`. A discount of `0` on the order is set: it switches the customer's discount off.

Example 1: discountFor({ discount: 20 }, { discount: 5 })  ->  20
Example 2: discountFor({ discount: 0 }, { discount: 5 })  ->  0
Example 3: discountFor({}, { discount: 5 })  ->  5
Example 4: discountFor({ discount: null }, {})  ->  0
