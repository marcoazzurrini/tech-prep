# Patient Loader (hard)

Write `loadPatiently(load, tries, ms)`. `load` is a function that returns a promise of some data.

Call `load`, and give it `ms` milliseconds. If it fulfils in time, fulfil with its data. If it rejects, or is still pending after `ms`, that try has failed: call `load` again at once. A try that ran out of time fails with `new Error("too slow")`.

Call `load` at most `tries` times. After the last failed try, reject with its error.

Example 1: a `load` that answers in 50 ms the first time and in 5 ms after that, with ms = 25  ->  the data of the second try
Example 2: loadPatiently(() => later(50, "x"), 2, 20)  ->  rejects with the error "too slow"

Note: `later` and `failLater` are helpers for the tests, at the top of the file.
