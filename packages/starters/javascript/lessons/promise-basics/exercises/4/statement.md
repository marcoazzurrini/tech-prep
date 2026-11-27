Write `cookLater(dish, ms)`. It returns a promise that is fulfilled with `dish + " is ready"` after `ms` milliseconds.

When `dish` is the empty string, the promise is rejected with an `Error` whose message is `"no dish"`.

Example 1: cookLater("soup", 10)  ->  a promise fulfilled with "soup is ready", 10 ms later
Example 2: cookLater("", 10)  ->  a promise rejected with Error("no dish")
