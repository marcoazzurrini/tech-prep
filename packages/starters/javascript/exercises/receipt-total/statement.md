# Receipt Total (medium)

A receipt is an array. It holds prices in euros as numbers, such as `4.35`. Between the prices there are notes: text, `null` or `true`. A note is never a price, even when it looks like one, such as `"19.99"`.

Write `receiptTotal(lines)`. It returns the total of the prices, as a whole number of cents.

Example 1: receiptTotal([4.35, "2 for 1", 1.15])  ->  550
Example 2: receiptTotal([0.1, 0.2])  ->  30
Example 3: receiptTotal(["closed", null])  ->  0
