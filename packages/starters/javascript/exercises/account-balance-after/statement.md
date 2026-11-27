# Final Balance (easy)

Write `finalBalance(start, transactions)`. It starts from the balance `start` and applies each transaction in order. It returns the balance at the end.

A transaction looks like `{ type, amount }`. A `"deposit"` adds the amount. A `"withdraw"` takes it away, but only when the balance is at least the amount. Otherwise the bank refuses it, and the balance stays as it was.

Example 1: finalBalance(10, [{ type: "deposit", amount: 5 }, { type: "withdraw", amount: 12 }])  ->  3
Example 2: finalBalance(5, [{ type: "withdraw", amount: 9 }])  ->  5
Example 3: finalBalance(10, [])  ->  10
