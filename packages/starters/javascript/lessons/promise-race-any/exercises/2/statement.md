Write `firstOrFallback(promise, ms, fallback)`. It returns a promise that settles like `promise`, if `promise` settles within `ms` milliseconds. Otherwise it fulfils with `fallback` once the time is up.

Example 1: a promise that gives "data" after 5 ms, with ms = 40  ->  "data"
Example 2: a promise that gives "data" after 50 ms, with ms = 20, fallback = "cached"  ->  "cached"
