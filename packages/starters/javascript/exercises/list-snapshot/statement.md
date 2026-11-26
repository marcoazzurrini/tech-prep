# List Snapshot (medium)

Write `snapshot(list)`. It takes an array and returns a function.

Each call of that function returns a new array, with the items the list had when `snapshot` was called.

A later change to `list` must not show. Neither must a change to an array that the function returned.

Example 1:
  const list = [1, 2];
  const get = snapshot(list);
  list.push(3);
  get()  ->  [1, 2]
