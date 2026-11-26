# Sums for Later (medium)

Write `lazySums(numbers)`. It returns an array of functions, one for each number.

The function at index `k` returns the sum of the numbers from index 0 to index `k`.

Example 1:
  const sums = lazySums([4, 1, 5]);
  sums[0]()  ->  4
  sums[1]()  ->  5
  sums[2]()  ->  10
