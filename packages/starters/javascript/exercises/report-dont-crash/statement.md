# Report, Don't Crash (medium)

Write `reporting(fn)`. It returns a new function that calls `fn` with the same `this` and the same arguments.

The new function never fails. When `fn` returns a value, it returns `{ ok: true, value }`. When `fn` fails, it returns `{ ok: false, reason }`.

`reason` is the `message` of the `Error` object that `fn` threw. If `fn` threw some other value, `reason` is that value turned into a string.

Example 1: reporting((a, b) => a + b)(2, 3)  ->  { ok: true, value: 5 }
Example 2:
  reporting(() => { throw new Error("no stock"); })()
  ->  { ok: false, reason: "no stock" }
Example 3: reporting(() => { throw 404; })()  ->  { ok: false, reason: "404" }
