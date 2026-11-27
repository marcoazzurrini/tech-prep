Write `stockReport(items)`. It returns a promise of one line per item, in the same order. `fetchStock(item)` gives a promise of how many are in stock.

A line is the item, a colon and the count. When `fetchStock` rejects, the line holds the error's `message` in place of the count.

Example 1: stockReport(["tea", "cake"])  ->  ["tea: 12", "cake: 0"]
Example 2: stockReport(["jam", "soup"])  ->  ["jam: 5", "soup: unknown item"]
Example 3: stockReport([])  ->  []
