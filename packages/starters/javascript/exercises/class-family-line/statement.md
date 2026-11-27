# Class Family Line (medium)

Write `parentNames(Class)`. It takes a class and returns the names of its parent class, of that one's parent class, and so on. The nearest comes first.

A class with no parent class gives an empty array.

Example 1: `Ebook` is a child class of `Book`, and `Book` has no parent class.
  parentNames(Ebook)  ->  ["Book"]
  parentNames(Book)  ->  []
Example 2: `Stack` is a child class of `Array`.
  parentNames(Stack)  ->  ["Array"]
