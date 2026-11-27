Write the generator function `averager()`. The caller starts it with `next()`, then sends numbers in with `next(number)`. Each time, it yields the average of all the numbers sent so far.

Before any number has arrived, it yields `null`. It never ends.

Example 1:
  const g = averager();
  g.next().value  ->  null
  g.next(10).value  ->  10
  g.next(20).value  ->  15
