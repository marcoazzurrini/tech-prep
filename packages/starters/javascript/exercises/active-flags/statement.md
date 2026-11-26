# Active Flags (easy)

Write `activeFlags(flags)`. It takes an object of feature flags and returns the names of the flags that are on, in the object's order.

A flag is on when its value is truthy.

Example 1: activeFlags({ dark: true, beta: 0, sync: "0" })  ->  ["dark", "sync"]
Example 2: activeFlags({ ads: "", tags: [] })  ->  ["tags"]
Example 3: activeFlags({})  ->  []
