# Remove Every Match (medium)

Write `removeEvery(list, value)`. It removes every item that is `===` to `value` from the array it is given. It returns the number of items it removed.

The caller's array must change. The items that stay keep their order.

Example 1:
  const list = [1, 2, 1, 3];
  removeEvery(list, 1)  ->  2
  list  ->  [2, 3]
Example 2:
  const list = ["a", "b"];
  removeEvery(list, "z")  ->  0
  list  ->  ["a", "b"]
