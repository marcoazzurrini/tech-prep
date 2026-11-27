# Fill in the Gaps (medium)

Write `partial(fn, ...fixed)`, a partial application that can leave gaps. The file exports `_`, which marks a gap.

`partial` returns a function. When it is called, it calls `fn` with the fixed arguments, but each `_` is replaced by the next argument of the call, in order. Arguments of the call that are left over go at the end. A gap with no argument to fill it becomes `undefined`.

The returned function keeps `this`, and returns what `fn` returns. It can be called many times.

Example 1: partial((a, b, c) => [a, b, c], 1, _, 3)(2)  ->  [1, 2, 3]
Example 2: partial((a, b, c) => [a, b, c], _, _, "c")("a", "b")  ->  ["a", "b", "c"]
Example 3: partial((...xs) => xs, _, 2)(1, 3, 4)  ->  [1, 2, 3, 4]
