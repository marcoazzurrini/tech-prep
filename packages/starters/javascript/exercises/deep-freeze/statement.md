# Deep Freeze (medium)

Write `deepFreeze(value)`. It freezes `value` and every nested object and array inside it, in place, and returns `value`.

If `value` is a primitive or `null`, return it as it is. Handle cycles so the function does not loop forever.

Example 1:
  const cfg = deepFreeze({ api: { retries: 3 } });
  cfg.api.retries = 5;  // throws a TypeError

Example 2:
  deepFreeze(null)  ->  null
