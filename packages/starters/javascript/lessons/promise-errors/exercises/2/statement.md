Write `stockLabel(id)`. It returns a promise of a label for an item: `"3 in stock"` when there are 3, and `"sold out"` when there are none.

`loadStock(id)` gives a promise of the count. For an unknown item it rejects. Count an unknown item as 0, so it is sold out too.

Example 1: stockLabel(1)  ->  a promise of "3 in stock"
Example 2: stockLabel(2)  ->  a promise of "sold out"
Example 3: stockLabel(99)  ->  a promise of "sold out"
