# Tax at the Till (easy)

`makeTill(taxPercent)` returns a till with two functions:

- `setTax(percent)` changes the tax.
- `priceOf(amount)` returns the amount with the tax added.

The code below ignores `setTax`: the price never changes. Fix it.

Example 1:
  const till = makeTill(20);
  till.priceOf(100)  ->  120
  till.setTax(10);
  till.priceOf(100)  ->  110
