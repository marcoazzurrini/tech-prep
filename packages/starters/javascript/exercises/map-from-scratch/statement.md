# Map from Scratch (medium)

Write `installMyMap(proto)`. It installs a `myMap(fn)` method on `proto`, like a polyfill.

If `proto` already has a `myMap` property, leave it unchanged. Otherwise add `myMap(fn)` to `proto`. It builds and returns a new array by calling `fn(item, index, list)` for each index from `0` to `this.length - 1`.

Do not change `this`, and do not use the built-in `map` method.

Example 1:
  const proto = {};
  installMyMap(proto);
  const list = Object.assign(Object.create(proto), { 0: 2, 1: 5, length: 2 });
  list.myMap((x) => x * 3)  ->  [6, 15]

Example 2:
  const proto = { myMap() { return "kept"; } };
  installMyMap(proto);
  Object.create(proto).myMap(() => 1)  ->  "kept"
