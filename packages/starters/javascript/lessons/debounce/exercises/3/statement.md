Add two methods to the debounced function that `debounce(fn, ms)` returns:

- `cancel()` drops the waiting call, so `fn` does not run.
- `pending()` returns `true` while a call is waiting, and `false` otherwise.

Example 1:
  const save = debounce(fn, 20);
  save.pending()  ->  false
  save("draft"); save.pending()  ->  true
  save.cancel(); save.pending()  ->  false, and fn never runs
