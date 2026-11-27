# Cart Summary (medium)

Write `cartSummary(items)`. Each item is an object with a `name` and a `price` in dollars. Return one line in American English (`en-US`): the number of items, their names as a list, and the total price.

For an empty cart, return `"Your cart is empty"`.

Example 1:
  cartSummary([{ name: "tea", price: 2.5 }, { name: "cake", price: 3.25 }, { name: "jam", price: 7 }])
  ->  "3 items (tea, cake, and jam) for $12.75"
Example 2: cartSummary([{ name: "tea", price: 2.5 }])  ->  "1 item (tea) for $2.50"
Example 3: cartSummary([])  ->  "Your cart is empty"
