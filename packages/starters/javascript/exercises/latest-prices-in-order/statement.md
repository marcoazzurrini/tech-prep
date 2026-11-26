# Latest Prices in Order (medium)

A shop gets a list of price updates. Each update is a pair: a product id and a price.

Write `latestPrices(updates)`. It returns one pair for each product: its id and its latest price. List the products in the order in which they first appear.

The ids are whole numbers, and they stay numbers in the result.

Example 1: latestPrices([[30, 5], [4, 9], [30, 6]])  ->  [[30, 6], [4, 9]]
Example 2: latestPrices([])  ->  []
