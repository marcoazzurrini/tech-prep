# Currency Registry (medium)

Write the constructor `Currency(code)`. `new Currency("EUR")` makes an object with `code` set to `"EUR"`.

There must be only one object for each code. Calling `new Currency` again with a code seen before gives back the object made the first time.

Example 1: new Currency("EUR").code  ->  "EUR"
Example 2: new Currency("USD") === new Currency("USD")  ->  true
Example 3: new Currency("GBP") === new Currency("JPY")  ->  false
Example 4: Object.keys(new Currency("NOK"))  ->  ["code"]
