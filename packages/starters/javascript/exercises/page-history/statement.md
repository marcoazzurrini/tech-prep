# Page History (medium)

Write a file that remembers the pages a reader has visited. It has three exports, and nothing else.

- The default export is a class `History`. `visit(page)` adds a page. `current()` returns the latest page, or `null` when there is none. `back()` removes the latest page and returns the one that is now current, or `null`. `size()` returns the number of pages.
- `LIMIT` is the number 3. A history keeps the latest `LIMIT` pages and drops older ones.
- `fromPages(pages)` returns a new `History` that has visited each page of the array, in order.

Example 1:
  const h = fromPages(["home", "cart", "pay", "done"])
  h.size()  ->  3
  h.current()  ->  "done"
  h.back()  ->  "pay"
  h.back()  ->  "cart"
  h.back()  ->  null
