`onlyNumbers(obj)` returns a view of `obj` that takes numbers only. Assigning a number through it stores the number in `obj`. Assigning anything else throws a `TypeError`.

Right now even a number throws. Fix it.

Example 1: const p = onlyNumbers({}); p.x = 2; then p.x  ->  2
Example 2: onlyNumbers({}).x = "a"  ->  throws a TypeError
