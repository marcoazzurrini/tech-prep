# Where Is It Defined? (medium)

Write `whereIsItDefined(obj, key)`. Given an object and a property name, return the first object that holds `key` as its own property, starting with `obj` and walking up its inheritance chain.

Return `null` when `key` is not found anywhere. A property whose value is `undefined` still counts as defined.

Example 1:
  const item = { price: 5 };
  whereIsItDefined(item, "price") === item  ->  true

Example 2:
  const base = { tax: 0.2 };
  const item = Object.create(base);
  whereIsItDefined(item, "tax") === base  ->  true

Example 3:
  whereIsItDefined({}, "missing")  ->  null
