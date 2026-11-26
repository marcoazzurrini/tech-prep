# Layered Settings (medium)

Write `resolveSetting(key, layers)`. `layers` is an array of settings objects, with the most specific one first. A layer may also be `null`.

Return the value of `key` from the first layer that sets it. A layer sets a key when the value there is not `null` and not missing. Return `null` when no layer sets the key.

Example 1: resolveSetting("retries", [{ retries: 0 }, { retries: 3 }])  ->  0
Example 2: resolveSetting("retries", [null, {}, { retries: 3 }])  ->  3
Example 3: resolveSetting("debug", [{ debug: null }, { debug: false }, { debug: true }])  ->  false
Example 4: resolveSetting("name", [])  ->  null
