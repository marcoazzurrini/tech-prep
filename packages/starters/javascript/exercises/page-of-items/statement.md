# Page of Items (easy)

Write `pageOf(items, size, page)`. It returns the items of one page, as a new array.

`size` is the number of items on a page. When it is `undefined` or not passed, one page holds every item. `page` counts from 1. When it is not passed, it is 1.

A page past the end is an empty array.

Example 1: pageOf(["a", "b", "c", "d", "e"], 2, 2)  ->  ["c", "d"]
Example 2: pageOf(["a", "b", "c", "d", "e"], 2)  ->  ["a", "b"]
Example 3: pageOf(["a", "b", "c"])  ->  ["a", "b", "c"]
Example 4: pageOf(["a", "b", "c"], undefined, 2)  ->  []
