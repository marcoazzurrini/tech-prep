`makeTicker(limit)` returns an iterator that gives 1, 2, 3 and so on, up to `limit`. Calling `next()` on it works, but spread and `for...of` reject it.

Make the iterator iterable too. It should carry on from where `next()` left off.

Example 1: [...makeTicker(3)]  ->  [1, 2, 3]
Example 2: const t = makeTicker(3); t.next(); [...t]  ->  [2, 3]
