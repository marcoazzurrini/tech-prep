Write `class NumberList extends Array`.

Add `sum()` which returns the sum of all numbers in the list (`0` if empty), and `average()` which returns `0` if empty or `this.sum() / this.length`.

Example 1:
  const nums = NumberList.from([2, 4, 6]);
  nums.sum()  ->  12
  nums.average()  ->  4

Example 2:
  const big = NumberList.from([1, 5, 9]).filter((n) => n >= 5);
  big instanceof NumberList  ->  true
  big.sum()  ->  14
