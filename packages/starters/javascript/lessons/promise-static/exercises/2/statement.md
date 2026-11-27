Write `laterValue(value, ms)`. It returns a plain object, not a promise.

The object must work with `Promise.resolve`. The promise that `Promise.resolve(laterValue(value, ms))` gives fulfils with `value`, after `ms` milliseconds.

Example 1: laterValue(1, 0) instanceof Promise  ->  false
Example 2: Promise.resolve(laterValue("hi", 10))  ->  a promise of "hi", after 10 ms
