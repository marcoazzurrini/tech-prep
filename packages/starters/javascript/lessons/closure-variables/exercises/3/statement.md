Write `makeIdMaker(prefix)`. It returns a function that gives the next id each time it is called: the prefix, a dash, and a number that starts at 1.

Each id maker counts on its own.

Example 1:
  const nextUser = makeIdMaker("user");
  const nextOrder = makeIdMaker("order");
  nextUser()  ->  "user-1"
  nextUser()  ->  "user-2"
  nextOrder()  ->  "order-1"
