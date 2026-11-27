# Assign What You Can (medium)

Write `assignWhatYouCan(target, source)`. It copies each own enumerable key of `source` to `target` by assignment, symbol keys included, as `Object.assign` does.

When a key cannot be written, it skips that key and goes on. It never throws. It returns the keys it skipped, in order.

Example 1: assignWhatYouCan({}, { a: 1, b: 2 })  ->  []
Example 2: assignWhatYouCan(Object.freeze({ a: 0 }), { a: 1, b: 2 })  ->  ["a", "b"]
