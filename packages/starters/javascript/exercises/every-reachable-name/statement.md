# Every Reachable Name (medium)

Write `reachableNames(obj)`. It returns every string key that `obj` can reach: its own keys, then the keys of its prototype, then of the next one, and so on. Keys that `for...in` skips count too.

Stop before `Object.prototype`, and leave out its keys. Leave out symbol keys. List each name once, at its first place.

Example 1: reachableNames({ a: 1, b: 2 })  ->  ["a", "b"]
Example 2:
  class Pet { name = "Rex"; feed() {} }
  reachableNames(new Pet())  ->  ["name", "constructor", "feed"]
