Write `stockEntry(product, count)`. It returns an object with two keys.

The key named after the product holds the count. The key `<product>Low` holds `true` when the count is under 5, and `false` otherwise.

Example 1: stockEntry("tea", 3)  ->  { tea: 3, teaLow: true }
Example 2: stockEntry("milk", 12)  ->  { milk: 12, milkLow: false }
