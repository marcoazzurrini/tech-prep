# Recently Opened (medium)

Write `createRecent(max)`. It returns an object that remembers the last files a user opened, newest first. It has two methods:

- `open(name)` records that the file was opened. A file opened again moves to the front, so each name appears once. When there are more than `max` names, the oldest ones are forgotten.
- `list()` returns the names as an array, newest first. Changing that array must not change what the object remembers.

Each call to `createRecent` starts its own, empty history.

Example 1:
  const recent = createRecent(2);
  recent.open("a.txt"); recent.open("b.txt"); recent.open("c.txt");
  recent.list()  ->  ["c.txt", "b.txt"]
Example 2:
  const recent = createRecent(3);
  recent.open("a.txt"); recent.open("b.txt"); recent.open("a.txt");
  recent.list()  ->  ["a.txt", "b.txt"]
