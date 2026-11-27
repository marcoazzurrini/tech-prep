`memoize(fn)` should work for functions with any number of arguments, and for methods.

The code below keys the cache by the first argument only, and it loses `this`. Fix both.

Example 1:
  const area = memoize((w, h) => w * h);
  area(2, 3)  ->  6
  area(2, 5)  ->  10
Example 2:
  const shop = { fee: 5, total: memoize(function (p) { return p + this.fee; }) };
  shop.total(10)  ->  15
