# Paged Feed (medium)

A server sends a feed in pages. `fetchPage(n)` returns the items of page `n` as an array. Pages are numbered from 0. An empty array means there are no more pages.

Write `feed(fetchPage)`. It returns an iterator over every item of every page, in order. It fetches a page only when its first item is asked for. The feed may never end, so never fetch ahead.

Example 1: [...feed((page) => (page < 2 ? [page * 10, page * 10 + 1] : []))]  ->  [0, 1, 10, 11]
Example 2: feed(fetchPage).next()  ->  calls fetchPage(0) once, and nothing more
