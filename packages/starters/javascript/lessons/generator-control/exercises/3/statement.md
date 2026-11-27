Write the generator function `tally()`. It counts words. The caller starts it with `next()`, then sends words in with `next(word)`. Each time, it yields how many words it has counted. It yields 0 before the first word.

A call to `throw(error)` resets the count. The generator yields 0 and keeps going.

Example 1:
  const t = tally();
  t.next().value  ->  0
  t.next("a").value  ->  1
  t.throw(new Error("reset")).value  ->  0
  t.next("b").value  ->  1
