Write `makeAccumulator(start)`. It returns a function.

Each call of that function takes a number, adds it to the total, and returns the new total. The total begins at `start`.

Example 1:
  const add = makeAccumulator(10);
  add(5)  ->  15
  add(1)  ->  16
