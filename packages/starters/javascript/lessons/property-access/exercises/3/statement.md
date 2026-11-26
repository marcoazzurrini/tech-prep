Write `stockLevel(warehouse, shelf, product)`. The warehouse maps a shelf name to an object, and that object maps a product to its count.

Return the count. Return `0` when the shelf or the product is not there.

Example 1: stockLevel({ a1: { tea: 4 } }, "a1", "tea")  ->  4
Example 2: stockLevel({ a1: { tea: 4 } }, "a1", "rice")  ->  0
Example 3: stockLevel({ a1: { tea: 4 } }, "b2", "tea")  ->  0
