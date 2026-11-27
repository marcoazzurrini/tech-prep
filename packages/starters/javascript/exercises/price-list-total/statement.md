# Price List Total (medium)

Write `orderTotal(prices, items)`. `prices` maps an item name to its price, and `items` is a list of item names. Return the sum of the prices of the items.

An item that is not on the price list costs nothing. Any word can be an item name.

Example 1: orderTotal({ tea: 3, cake: 5 }, ["tea", "cake", "tea"])  ->  11
Example 2: orderTotal({ tea: 3 }, ["tea", "bread"])  ->  3
Example 3: orderTotal({ tea: 3 }, ["toString"])  ->  0
