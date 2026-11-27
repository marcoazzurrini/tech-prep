`addLater(a, b, callback)` should wait 10 ms, then call `callback` with `a + b`.

The code below returns the sum from inside the timer, so nobody gets it. Fix it.

Example 1:
  addLater(2, 3, (sum) => console.log(sum))
  prints 5, 10 ms later
