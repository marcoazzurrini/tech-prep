# Receipt Lines (easy)

`receiptLines(items)` takes the items of an order. Each item has a `price` and a `qty`.

It should return one object for each item, holding the item's total: `{ total: price * qty }`.

The code below returns `undefined`. Fix it.

Example 1: receiptLines([{ price: 2, qty: 3 }])  ->  [{ total: 6 }]
Example 2: receiptLines([])  ->  []
