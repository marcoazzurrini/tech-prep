Write `appendAll(target, items)`.

`target` is an array-like object and `items` is an array. Add every element of `items` to the end of `target`, updating `target.length`, and return the new `length`.

Example 1:
  const box = { 0: "a", length: 1 };
  appendAll(box, ["b", "c"])  ->  3 (box now has 1: "b", 2: "c", length: 3)
