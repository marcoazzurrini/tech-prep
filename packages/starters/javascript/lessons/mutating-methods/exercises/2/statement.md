Write `takeBatch(queue, size)`. It removes the first `size` items from `queue` and returns them, in order, in an array.

`queue` itself must change. When it holds fewer than `size` items, take them all.

Example 1:
  const queue = [1, 2, 3, 4, 5];
  takeBatch(queue, 2)  ->  [1, 2]
  queue  ->  [3, 4, 5]
Example 2:
  const queue = ["a"];
  takeBatch(queue, 3)  ->  ["a"]
  queue  ->  []
