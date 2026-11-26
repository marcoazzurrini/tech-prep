`canCheckOut(cart)` should return `true` when the cart has at least one item and an address. Otherwise it should return `false`.

The code below returns other values, such as `0` or the address. Fix it.

Example 1: canCheckOut({ items: ["pen"], address: "12 Elm Street" })  ->  true
Example 2: canCheckOut({ items: [], address: "12 Elm Street" })  ->  false
Example 3: canCheckOut({ items: ["pen"], address: "" })  ->  false
