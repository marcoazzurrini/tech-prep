# Cache Large Reports (medium)

Write `createCache(load, makeRef)`. It returns an object with one method, `get(key)`. `load(key)` builds a large report object, which is slow.

`get(key)` returns the report for `key`. It calls `load` only when it has no report for that key, or when the report it stored has been collected. The cache must not keep the reports alive: store `makeRef(report)`, not the report.

`makeRef(value)` gives an object whose `deref()` returns the value, or `undefined` once it is collected. By default it is `new WeakRef(value)`. Some tests pass a fake one.

Example 1:
  const cache = createCache(load)
  cache.get("q3") === cache.get("q3")  ->  true, and load ran once

Example 2:
  const cache = createCache(load, () => ({ deref: () => undefined }))
  cache.get("q3"), then cache.get("q3")  ->  load runs both times
