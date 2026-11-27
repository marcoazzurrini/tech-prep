# Wallet Balance (medium)

Write `Wallet(start)`, used as `new Wallet(start)`. A wallet has three methods:

- `deposit(amount)` adds money and returns the new balance.
- `withdraw(amount)` takes money out and returns the new balance. It throws a `RangeError` when the amount is more than the balance.
- `balance()` returns the balance.

No code outside may read or change the balance except through these methods, so `JSON.stringify(wallet)` gives `"{}"`. The methods must also work when they are taken off the wallet.

Example 1: new Wallet(10), then deposit(5), then balance()  ->  15
Example 2: new Wallet(5), then withdraw(9)  ->  throws a RangeError
Example 3: JSON.stringify(new Wallet(10))  ->  "{}"
