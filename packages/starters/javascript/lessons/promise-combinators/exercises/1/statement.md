Write `allKeyed(tasks)`. `tasks` is an object whose values are promises or plain values.

Return a promise of an object with the same keys. Each key holds its value once its promise has fulfilled. If one rejects, reject at once with its reason.

Example 1: allKeyed({ user: later(30, "Ada"), cart: 3 })  ->  { user: "Ada", cart: 3 }
Example 2: allKeyed({ a: later(40, 1), b: failLater(5, "no stock") })  ->  rejects with the error "no stock"

Note: `later` and `failLater` are helpers for the tests, at the top of the file.
