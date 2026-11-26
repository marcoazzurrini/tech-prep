Write `remember(cache, key, compute)`. It returns `cache[key]`.

When the cache holds `null` or nothing for the key, it first calls `compute()` and stores the result under the key. When a value is there, even `0` or `""`, it must not call `compute`.

Example 1:
  const cache = {};
  remember(cache, "tax", () => 22)  ->  22
  cache.tax  ->  22
