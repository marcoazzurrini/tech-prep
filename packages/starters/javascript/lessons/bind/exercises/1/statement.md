`describer(book)` should return a function that gives the book's description. It must work however it is called.

The code below returns the method on its own, so the method loses `this`. Fix it.

Example 1:
  const book = { title: "Dune", describe() { return "Book: " + this.title; } };
  const read = describer(book);
  read()  ->  "Book: Dune"
