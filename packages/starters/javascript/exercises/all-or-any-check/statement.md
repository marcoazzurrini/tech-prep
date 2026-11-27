# All or Any (medium)

Write two methods that every array gets.

- `myEvery(test, thisArg)` returns `true` when `test` returns a truthy value for every item, and `false` as soon as it returns a falsy one.
- `mySome(test, thisArg)` returns `true` as soon as `test` returns a truthy value for an item, and `false` when it never does.

Both stop calling `test` once the answer is known. `test` gets the item, its index and the array, with `this` set to `thisArg`. Empty spots in the array are skipped, so `test` is never called for them.

Example 1: [2, 4, 6].myEvery((n) => n % 2 === 0)  ->  true
Example 2: [1, 3, 4].mySome((n) => n % 2 === 0)  ->  true
Example 3: [].myEvery(() => false)  ->  true

Note: solve it without the built-in `every` and `some`.
