# Pay per Lookup (medium)

A map service charges for every call to `lookup(from, to)`. It returns the distance between two towns, and the answer for a pair of towns never changes.

Write `fewerLookups(lookup)`. It returns a function that takes the same two arguments and gives the same result as `lookup`. It calls `lookup` only the first time it gets a pair. A later call with the same pair gives the result of that first time, without calling `lookup`.

Order matters: `("York", "Leeds")` and `("Leeds", "York")` are two different pairs. A result can be any value, even `0` or `null`. Each call of `fewerLookups` keeps its own results.

Example 1:
  const distance = fewerLookups(lookup);
  distance("York", "Leeds")  ->  calls lookup, and returns its result
  distance("York", "Leeds")  ->  the same result, and lookup is not called
