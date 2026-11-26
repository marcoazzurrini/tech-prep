# Order Receipt (medium)

Write `receipt(items)`. Each item has a `name`, a `qty` and a `price` for one piece. Return the receipt as one string.

- There is one line for each item: the quantity, the name and the price of that quantity.
- The name starts with a capital letter on the receipt.
- The last line is the total of the order.
- There is a line break between two lines, and none at the end.

Example 1:
  receipt([{ name: "pen", qty: 2, price: 3 }, { name: "ink", qty: 1, price: 15 }])
  ->  "2 x Pen = 6\n1 x Ink = 15\nTotal: 21"
Example 2: receipt([])  ->  "Total: 0"
