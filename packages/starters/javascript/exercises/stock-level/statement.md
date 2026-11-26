# Stock Level (easy)

Write two functions that are used as methods of a product. A product is an object with two numbers: `stock` and `minimum`.

- `restock(amount)` adds `amount` to the stock of its product, and returns the new stock.
- `isLow()` returns `true` when the stock of its product is below its minimum.

The tests put your functions on a product, then call them as methods.

Example 1:
  const tea = { stock: 2, minimum: 5, restock, isLow };
  tea.isLow()  ->  true
  tea.restock(4)  ->  6
  tea.isLow()  ->  false
