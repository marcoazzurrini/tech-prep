# Combination Locker (medium)

Write a class `Locker`. `new Locker(code)` makes a locker that opens with the number `code`.

- `open(guess)` returns `true` when `guess` is the code. A wrong guess returns `false` and counts as a failure. A right guess sets the failures back to `0`.
- After three failures in a row, the locker is blocked. A blocked locker returns `false` from `open`, even for the right code.
- `isBlocked()` returns whether the locker is blocked.
- `changeCode(oldCode, newCode)` checks `oldCode` exactly as `open` does. When the check passes, it sets the new code and returns `true`. Otherwise it returns `false`.

No code outside the class may read or change the code or the failures. A locker has no properties: `Object.keys(locker)` gives `[]`.

Example 1:
  const locker = new Locker(1234);
  locker.open(1111)  ->  false
  locker.open(1234)  ->  true
  locker.changeCode(1234, 42)  ->  true
  locker.open(1234)  ->  false

Example 2:
  const locker = new Locker(7);
  locker.open(1); locker.open(2); locker.open(3);
  locker.isBlocked()  ->  true
  locker.open(7)  ->  false
