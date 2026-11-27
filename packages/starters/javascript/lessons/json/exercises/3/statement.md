Write `createMoney(amount, currency)`. It returns an object with `amount`, `currency`, and a `toJSON()` method that returns `"<amount> <currency>"`.

Example 1:
  JSON.stringify(createMoney(15, "USD"))  ->  '"15 USD"'

Example 2:
  JSON.stringify({ total: createMoney(40, "EUR") })  ->  '{"total":"40 EUR"}'
