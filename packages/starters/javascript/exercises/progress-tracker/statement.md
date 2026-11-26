# Progress Tracker (medium)

Write `createProgress(total)`. It tracks how many of `total` steps are done, and returns an object with exactly three properties. None of them is a method.

- `done` starts at `0`. It reads and assigns like a plain number. Assigning a number below `0` or above `total` throws a `RangeError`, and `done` keeps its value.
- `percent` is the share of steps done, from `0` to `100`, rounded to a whole number.
- `isComplete` is `true` when every step is done.

`percent` and `isComplete` always follow `done`. Assigning to them does not change them.

`Object.keys` of the object gives `done`, `percent` and `isComplete`, and nothing else. So the object has no other property that holds the count.

Example 1:
  const progress = createProgress(8);
  progress.done = 2;
  progress.percent  ->  25
  progress.isComplete  ->  false
  progress.done = 9;  // throws a RangeError
  progress.done  ->  2

Constraints: `total` is a whole number above 0.
