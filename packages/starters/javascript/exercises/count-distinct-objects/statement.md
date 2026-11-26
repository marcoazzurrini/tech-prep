# Count the Objects (easy)

Write `countObjects(list)`. The list holds objects, and the same object can be in it more than once. Return how many different objects the list holds.

Two objects with the same content still count as two.

Example 1:
  const a = { id: 1 };
  countObjects([a, a, a])  ->  1
Example 2:
  const a = { id: 1 };
  countObjects([a, { id: 1 }, a])  ->  2
Example 3: countObjects([])  ->  0
