# Discounted Order (medium)

Write `class Order` and `class DiscountedOrder extends Order`.

`Order` takes an array of positive numbers `prices` in its constructor. It has a static method `currency()` returning `"USD"`, a getter `total` returning the sum of `prices`, and a method `receipt()` returning `"<currency> <total>"` using the class's `currency()` and `this.total`.

`DiscountedOrder` takes `(prices, percent)` in its constructor, where `percent` is between `0` and `100`. Its getter `total` returns the base total reduced by `percent` percent. Its `receipt()` returns the base receipt followed by `" (<percent>% off)"`. Its static `currency()` returns `"USD-PROMO"`.

Example 1:
  const o = new Order([20, 30]);
  o.total  ->  50
  o.receipt()  ->  "USD 50"

Example 2:
  const d = new DiscountedOrder([20, 80], 25);
  d.total  ->  75
  d.receipt()  ->  "USD-PROMO 75 (25% off)"
