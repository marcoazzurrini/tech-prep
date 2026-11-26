`createProduct(name, price)` should return a product whose `price` reads and assigns like a plain property. Assigning a negative price throws a `RangeError`, and the product keeps the price it had.

The code below fails as soon as `price` is read or assigned. Fix it.

Example 1:
  const pen = createProduct("Pen", 3);
  pen.price  ->  3
  pen.price = 5;
  pen.price  ->  5
