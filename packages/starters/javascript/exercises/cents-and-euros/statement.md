# Cents and Euros (medium)

Write a class `Price`. `new Price(cents)` holds an amount of money as a whole number of cents.

- `price.cents` reads the amount in cents. Assigning `price.cents = value` accepts only a whole number that is `0` or more. For anything else it throws a `RangeError` and keeps the old amount. The constructor checks its argument the same way.
- `price.euros` reads the amount in euros. Assigning `price.euros = value` rounds to the nearest cent, then sets the cents with the same check.
- `Price.zero` gives a new `Price` of `0` cents each time it is read.
- `JSON.stringify(price)` gives both amounts, such as `{"cents":1999,"euros":19.99}`.

No code outside the class may change the amount without the check. A price has no own properties: `Object.keys` gives `[]`.

Example 1:
  const price = new Price(0);
  price.euros = 19.99;
  price.cents  ->  1999
  JSON.stringify(price)  ->  '{"cents":1999,"euros":19.99}'

Example 2: Price.zero === Price.zero  ->  false
