`readOrder(text)` takes an order as JSON text. It should return a promise of the number of items in the order.

When the text is broken, the promise should reject. The call itself must never throw.

The code below throws at the call when the text is broken. Fix it.

Example 1: readOrder('{"items":[1,2]}')  ->  2
Example 2: readOrder("{bad")  ->  rejects with a SyntaxError
