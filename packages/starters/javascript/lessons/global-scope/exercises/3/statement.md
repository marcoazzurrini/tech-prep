`currency()` should return the global `shopCurrency` when the program has set one, and `"EUR"` when it has not.

The code below throws when there is no `shopCurrency`. Fix it.

Example 1: after `globalThis.shopCurrency = "USD"`, currency()  ->  "USD"
Example 2: with no `shopCurrency`, currency()  ->  "EUR"
