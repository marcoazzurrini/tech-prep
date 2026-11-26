# Stock Rows (medium)

`stockRows(products)` builds the rows of a stock table. Each product has a `name`. It may have a `count`, and it may be `hidden`.

It should return one row for each product that is not hidden: `{ name, left }`. `left` is the product's count, or `"unknown"` when the count is `null` or missing.

The code below returns the wrong rows. Fix it.

Example 1: stockRows([{ name: "tea", count: 4 }])  ->  [{ name: "tea", left: 4 }]
Example 2: stockRows([{ name: "jam", count: 0 }])  ->  [{ name: "jam", left: 0 }]
Example 3: stockRows([{ name: "oil", hidden: true }])  ->  []
