# A Faithful Copy (medium)

Write `faithfulCopy(source)`. It returns a new object with the same own properties as `source`. Nested objects are shared, not copied.

Each property behaves in the copy as it does in the source:

- A property with a getter or a setter keeps them. It is not replaced by the value it gave at the time of the copy.
- A property that cannot be assigned still cannot be assigned.
- A property that cannot be deleted still cannot be deleted.
- A property that `Object.keys` does not list is copied too, and is still not listed.

Example 1:
  const cart = { price: 2, get double() { return this.price * 2; } };
  const copy = faithfulCopy(cart);
  copy.price = 5;
  copy.double  ->  10
  cart.double  ->  4

Note: the keys are strings.
