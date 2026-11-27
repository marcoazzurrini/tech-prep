# Hidden Account Balance (medium)

Write a class `Account`. A new account holds `0`.

- `deposit(amount)` adds `amount` to the balance.
- `withdraw(amount)` takes `amount` out. If the balance is too small, it throws a `RangeError` and leaves the balance as it was.
- `balance()` returns the current balance.

The balance must not be visible on the account object: the object has no own properties at all. A frozen account still works.

Example 1:
  const a = new Account();
  a.deposit(50);
  a.withdraw(20);
  a.balance()  ->  30

Example 2: JSON.stringify(new Account())  ->  "{}"

Note: Solve it without `#` private fields.
